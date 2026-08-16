import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

/**
 * 绝对化用语合规整改脚本（针对线上 Payload/PostgreSQL 数据库）。
 *
 * 背景：官网遭举报使用「一流」等绝对化用语，违反《广告法》第9条第3项。
 * 本脚本对 Globals 与内容型集合的全部文本字段（含富文本 Lexical 中的
 * {type:'text', text} 文本节点）执行「短语级替换」，只改动命中词所在位置，
 * 保留字段内其他内容与结构（不覆盖后台人工编辑）。
 *
 * 用法：
 *   tsx -r dotenv/config scripts/remediate-absolute-claims.ts        # dry-run：只扫描并输出报告，不写库
 *   tsx -r dotenv/config scripts/remediate-absolute-claims.ts --apply # 写库，写库后回读校验核心禁用词，有残留则 exit 1
 */

// 短语替换表（旧 -> 新）。运行时按 length 降序排序，保证长短语先于短短语被替换（如「世界一流」先于「一流」）。
const RAW_PAIRS: Array<[string, string]> = [
  ['创新化学科技，引领行业未来', '创新化学科技，助力行业发展'],
  ['成为全球领先的化工产品供应商，引领行业技术创新和可持续发展', '成为值得信赖的化工产品供应商，持续推动行业技术创新和可持续发展'],
  ['性能指标达到国际领先水平', '性能指标在同类产品中保持较高水平'],
  ['采用一流的研发和生产设备，拥有一流的研发团队', '采用先进的研发和生产设备，拥有专业的研发团队'],
  ['配备最先进的生产设备和技术', '配备先进的生产设备和技术'],
  ['引领行业技术发展方向', '推动行业技术进步'],
  ['全球领先的化工产品供应商', '值得信赖的化工产品供应商'],
  ['汇聚国内外化工领域顶尖专家', '汇聚国内外化工领域资深专家'],
  ['世界一流的生产设施', '高标准的生产设施'],
  ['达到世界先进水平', '符合国家及行业标准'],
  ['引领行业技术创新和可持续发展', '推动行业技术创新和可持续发展'],
  ['一流的研发和生产设备', '先进的研发和生产设备'],
  ['达到国际领先水平', '达到较高水平'],
  ['一流生产和检测设备', '先进的生产和检测设备'],
  ['国际领先水平', '较高水平'],
  ['引领行业技术创新', '推动行业技术创新'],
  ['拥有一流的研发团队', '拥有专业的研发团队'],
  ['一流产品、提供一流服务', '优质产品、提供专业服务'],
  ['引领行业未来', '助力行业发展'],
  ['世界一流', '高品质'],
  ['世界先进水平', '较高水平'],
  ['全球领先', '行业知名的'],
  ['顶尖专家', '资深专家'],
  ['最先进', '先进'],
  ['引领行业', '推动行业发展'],
  ['一流产品', '优质产品'],
  ['一流服务', '优质服务'],
  ['一流', '优质'],
]

// 按短语长度降序排序，保证长短语先于短短语被替换（如「世界一流」先于「一流」）
const REPLACE_MAP: Array<[string, string]> = [...RAW_PAIRS].sort((a, b) => b[0].length - a[0].length)

// 核心禁用词：--apply 写库后全库回读校验，任一残留即 exit 1。
const CORE_BANNED = ['一流', '最先进', '世界一流', '全球领先', '顶尖', '国际领先', '世界先进', '引领行业']

// 含文本内容的集合（其余集合如 users 不做扫描）
const TEXT_COLLECTIONS = ['hero-banners', 'news', 'products', 'careers']

interface ScanResult {
  location: string
  field: string
  old: string
  new: string
}

/**
 * 递归扫描任意（可能嵌套的）值，对字符串应用 REPLACE_MAP；
 * 返回是否发生变更以及替换后的新值。old 仅用于报告，不参与判定。
 */
function walkText(value: unknown, path: string, hits: ScanResult[]): { changed: boolean; next: unknown } {
  if (typeof value === 'string') {
    let v = value
    let changed = false
    for (const [old, nw] of REPLACE_MAP) {
      if (v.includes(old)) {
        v = v.split(old).join(nw)
        changed = true
        hits.push({ location: path, field: old, old, new: nw })
      }
    }
    return { changed, next: v }
  }
  if (Array.isArray(value)) {
    let any = false
    const out = value.map((item, i) => {
      const r = walkText(item, `${path}[${i}]`, hits)
      if (r.changed) any = true
      return r.next
    })
    return { changed: any, next: out }
  }
  if (value && typeof value === 'object') {
    let any = false
    const obj: Record<string, unknown> = {}
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      const r = walkText(v, `${path}.${key}`, hits)
      obj[key] = r.next
      if (r.changed) any = true
    }
    return { changed: any, next: obj }
  }
  return { changed: false, next: value }
}

// 写库前剔除 Payload 只读/自管字段，避免 update 时被拒或覆盖版本信息
function stripMeta(value: unknown): unknown {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const obj: Record<string, unknown> = { ...(value as Record<string, unknown>) }
    for (const k of ['id', '_id', 'createdAt', 'updatedAt', '_version', '__v']) {
      delete obj[k]
    }
    return obj
  }
  return value
}

async function main() {
  const apply = process.argv.includes('--apply')
  const payload = await getPayload({ config })
  const hits: ScanResult[] = []

  // 全部 Globals
  for (const g of payload.config.globals) {
    const slug = g.slug as unknown as string
    let doc: unknown
    try {
      doc = await payload.findGlobal({ slug: slug as never, depth: 2 })
    } catch {
      continue // Global 未创建，跳过
    }
    const r = walkText(doc, slug, hits)
    if (!apply) continue
    if (r.changed) {
      await payload.updateGlobal({ slug: slug as never, data: stripMeta(r.next) as never })
    }
  }

  // 内容型集合
  for (const slug of TEXT_COLLECTIONS) {
    if (!payload.config.collections.some((c: any) => c.slug === slug)) continue
    const { docs } = await payload.find({ collection: slug as never, depth: 2, limit: 5000 })
    for (const d of docs) {
      const r = walkText(d, `${slug}#${d.id}`, hits)
      if (!apply) continue
      if (r.changed) {
        await payload.update({ collection: slug as never, id: d.id, data: stripMeta(r.next) as never })
      }
    }
  }

  // 报告
  console.log(`\n=== ${apply ? 'APPLY' : 'DRY-RUN'} 扫描报告（命中 ${hits.length} 次替换） ===`)
  for (const h of hits) {
    console.log(`\n[${h.location}] ${h.field}`)
    console.log(`  旧: ${h.old}`)
    console.log(`  新: ${h.new}`)
  }

  // --apply 后回读校验核心禁用词
  if (apply) {
    const remains: string[] = []
    const check = (value: unknown, at: string) => {
      if (typeof value === 'string') {
        for (const w of CORE_BANNED) {
          if (value.includes(w)) remains.push(`${at}(${w}): ${value.slice(0, 80)}`)
        }
      } else if (Array.isArray(value)) {
        value.forEach((v, i) => check(v, `${at}[${i}]`))
      } else if (value && typeof value === 'object') {
        Object.entries(value as Record<string, unknown>).forEach(([k, v]) => check(v, `${at}.${k}`))
      }
    }
    for (const g of payload.config.globals) {
      try {
        check(await payload.findGlobal({ slug: g.slug as never, depth: 2 }), g.slug as unknown as string)
      } catch {
        /* skip */
      }
    }
    for (const slug of TEXT_COLLECTIONS) {
      const { docs } = await payload.find({ collection: slug as never, depth: 2, limit: 5000 })
      for (const d of docs) check(d, slug)
    }
    if (remains.length) {
      console.error('\n⚠️ 写库后仍发现核心禁用词残留：')
      remains.forEach((r) => console.error('  ' + r))
      console.error('数据库整改未完全成功，请人工介入。')
      process.exit(1)
    }
    console.log('\n✅ 写库后全库校验通过：核心禁用词无残留。')
  } else {
    console.log('\n（dry-run 模式，未写库。确认无误后执行：`tsx -r dotenv/config scripts/remediate-absolute-claims.ts --apply`）')
  }

  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})