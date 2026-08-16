import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

// 把纯文本(段落 + "- " 列表)手动构造成 lexical 状态，避免引入 jsdom
function textNode(text: string) {
  return { type: 'text', format: 0, version: 1, text, style: '', detail: 0, mode: 'normal' }
}

function textToLexical(text: string) {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim())
  const children = paragraphs.map((p) => {
    const lines = p.split('\n').filter((l) => l.trim())
    if (lines.length > 0 && lines.every((l) => l.trim().startsWith('-'))) {
      return {
        type: 'list',
        format: '',
        direction: null,
        indent: 0,
        version: 1,
        listType: 'bullet',
        tag: 'ul',
        start: 1,
        children: lines.map((l) => ({
          type: 'listitem',
          format: '',
          direction: null,
          indent: 0,
          version: 1,
          value: 1,
          children: [textNode(l.replace(/^\s*-\s*/, '').trim())],
        })),
      }
    }
    return {
      type: 'paragraph',
      format: '',
      direction: null,
      indent: 0,
      version: 1,
      children: [textNode(lines.join(' '))],
    }
  })
  return {
    root: {
      type: 'root',
      format: '',
      direction: null,
      indent: 0,
      version: 1,
      children,
    },
  }
}

async function main() {
  const payload = await getPayload({ config })

  // 1. 管理员
  const email = 'admin@unicechemical.com'
  const exists = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })
  if (exists.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: { email, password: 'admin123456', role: 'admin', displayName: '系统管理员' },
    })
    console.log('✓ 创建管理员:', email)
  }

  // 2. 产品分类
  const categoryDefs = [
    { name: '热塑性树脂', slug: 'thermoplastic-resins', description: '包括丙烯酸、PP树脂等热塑性材料，适用于物理干燥型涂料' },
    { name: '热固性树脂', slug: 'thermosetting-resins', description: '包括聚酯、氨基树脂等，需交联固化，性能优异' },
    { name: '水性体系', slug: 'waterborne-systems', description: '环保型水性乳液和分散体，低VOC排放' },
    { name: '功能性树脂', slug: 'functional-resins', description: '具有触变、附着力促进等特殊功能的树脂' },
    { name: '助剂与添加剂', slug: 'additives', description: '蜡分散体、特殊单体及改性剂' },
  ]
  const categoryIds: Record<string, number | string> = {}
  for (const c of categoryDefs) {
    const existing = await payload.find({ collection: 'categories', where: { slug: { equals: c.slug } }, limit: 1 })
    if (existing.docs.length > 0) {
      categoryIds[c.slug] = existing.docs[0].id
    } else {
      const doc = await payload.create({ collection: 'categories', data: c })
      categoryIds[c.slug] = doc.id
    }
  }
  console.log('✓ 产品分类', Object.keys(categoryIds).length, '个')

  // 3. 新闻分类
  const newsCategoryDefs = [
    { name: '公司新闻', slug: 'company-news', description: '公司内部新闻和公告', color: '#d4af37', sort_order: 1, is_active: true },
    { name: '行业资讯', slug: 'industry-news', description: '化工行业最新动态和政策', color: '#3498db', sort_order: 2, is_active: true },
    { name: '产品发布', slug: 'product-release', description: '新产品发布和更新', color: '#2ecc71', sort_order: 3, is_active: true },
    { name: '企业活动', slug: 'corporate-events', description: '公司举办的各类活动', color: '#e74c3c', sort_order: 4, is_active: true },
    { name: '技术创新', slug: 'technology-innovation', description: '技术研发和创新成果', color: '#9b59b6', sort_order: 5, is_active: true },
    { name: '社会责任', slug: 'social-responsibility', description: '社会责任与公益活动', color: '#16a085', sort_order: 6, is_active: true },
  ]
  const newsCategoryIds: Record<string, number | string> = {}
  for (const c of newsCategoryDefs) {
    const existing = await payload.find({ collection: 'news-categories', where: { slug: { equals: c.slug } }, limit: 1 })
    if (existing.docs.length > 0) {
      newsCategoryIds[c.slug] = existing.docs[0].id
    } else {
      const doc = await payload.create({ collection: 'news-categories', data: c })
      newsCategoryIds[c.slug] = doc.id
    }
  }
  console.log('✓ 新闻分类', Object.keys(newsCategoryIds).length, '个')

  // 4. 产品
  const productDefs: any[] = [
    {
      name: '丙烯酸树脂 (TPA-200)',
      cas_no: '25035-69-2',
      category: categoryIds['thermoplastic-resins'],
      description: '高性能热塑性丙烯酸树脂，专为汽车修补漆和高端工业涂料设计。',
      details: [
        { name: '外观', value: '无色透明颗粒或液体' },
        { name: '固含量', value: '50% ± 1%' },
        { name: '粘度', value: '2000-4000 mPa.s' },
        { name: '酸值', value: '4-8 mgKOH/g' },
        { name: '玻璃化温度', value: '60°C' },
        { name: '溶剂体系', value: '甲苯/二甲苯' },
      ],
      image_url: '/images/products/acrylic-resin.jpg',
      features: ['优异的金属颜料定向排列性', '极佳的耐候性和保光性', '干燥速度快，硬度高', '与CAB和NC相容性好', '优异的耐醇性'],
      applications: [
        { name: '汽车修补漆', description: '用于制造高品质汽车修补底色漆和清漆' },
        { name: '塑胶涂料', description: 'ABS、PS等塑料表面的装饰性涂装' },
        { name: '集装箱涂料', description: '耐候性要求高的户外金属保护涂层' },
        { name: '一般工业漆', description: '机械设备和五金件的面漆' },
      ],
      safety_info: [
        { title: '危险性', content: '易燃液体' },
        { title: '储存条件', content: '阴凉通风处，远离火源，库温不宜超过30℃' },
        { title: '防护措施', content: '操作时需佩戴防毒面具和耐溶剂手套' },
        { title: '急救措施', content: '吸入蒸气需迅速脱离现场至空气新鲜处' },
      ],
      is_active: true,
    },
    {
      name: 'PP树脂 (CPP-300)',
      cas_no: '68442-33-1',
      category: categoryIds['thermoplastic-resins'],
      description: '氯化聚丙烯树脂，专用于PP底材的附着力促进与复合油墨。',
      details: [
        { name: '外观', value: '微黄色颗粒' },
        { name: '氯含量', value: '25% ± 2%' },
        { name: '粘度', value: '500-2000 mPa.s' },
        { name: '软化点', value: '90-110°C' },
        { name: '溶剂体系', value: '甲苯/乙酸乙酯' },
      ],
      image_url: '/images/products/pp-resin.jpg',
      features: ['对PP底材附着力优异', '与多种树脂相容性好', '耐化学药品性佳'],
      applications: [
        { name: 'PP底材处理剂', description: 'PP塑料表面喷涂底漆' },
        { name: '复合油墨', description: 'OPP薄膜印刷复合油墨' },
        { name: '汽车内饰胶粘剂', description: 'PP件粘接用胶粘剂' },
      ],
      safety_info: [
        { title: '危险性', content: '可燃固体' },
        { title: '储存条件', content: '阴凉干燥处，避免阳光直射' },
        { title: '防护措施', content: '远离火源，保持通风' },
      ],
      is_active: true,
    },
    {
      name: '触变型树脂 (SCA-50)',
      cas_no: '307531-94-6',
      category: categoryIds['functional-resins'],
      description: '自带触变功能的两烯酸树脂，适用于抗流挂涂料体系。',
      details: [
        { name: '外观', value: '淡黄色透明液体' },
        { name: '固含量', value: '50% ± 2%' },
        { name: '粘度', value: '1500-3000 mPa.s' },
        { name: '触变指数', value: '≥3.0' },
      ],
      image_url: '/images/products/sca-resin.jpg',
      features: ['优异的抗流挂性能', '良好的金属颜料排列', '储存稳定性好'],
      applications: [
        { name: '汽车金属闪光漆', description: '高抗流挂金属闪光面漆' },
        { name: '重防腐涂料', description: '厚膜型防腐涂料' },
        { name: '效果颜料分散', description: '珠光粉等效果颜料定向' },
      ],
      safety_info: [
        { title: '危险性', content: '易燃液体' },
        { title: '储存条件', content: '阴凉通风处，远离火源' },
        { title: '防护措施', content: '操作时佩戴防护眼镜和手套' },
      ],
      is_active: true,
    },
  ]
  for (const p of productDefs) {
    // 重建：先删除同名产品再创建，保证结构化字段（details/features/applications/safety_info）始终为最新
    const existingProduct = await payload.find({ collection: 'products', where: { name: { equals: p.name } }, limit: 1 })
    if (existingProduct.docs.length > 0) {
      await payload.delete({ collection: 'products', id: existingProduct.docs[0].id })
    }
    await payload.create({
      collection: 'products',
      data: {
        ...p,
        description: textToLexical(p.description || ''),
        summary: p.summary || (p.description || '').slice(0, 60),
        details: (p.details || []).map((d: any) => ({ name: d.name, value: d.value })),
        features: (p.features || []).map((f: string) => ({ text: f })),
        applications: (p.applications || []).map((a: any) => ({ name: a.name, description: a.description })),
        safety_info: (p.safety_info || []).map((s: any) => ({ title: s.title, content: s.content })),
      },
    })
  }
  console.log('✓ 产品', productDefs.length, '个')

  // 5. 新闻
  const newsDefs = [
    {
      title: '江西联合化工荣获2024年度化工行业创新奖',
      excerpt: '凭借在新材料研发领域的突出贡献，江西联合化工荣获中国化工协会颁发的年度创新奖。',
      content: `江西联合化工有限公司在2024年度中国化工协会评选中荣获"化工行业创新奖"，这是对公司在新材料研发领域卓越贡献的高度认可。

本次获奖的创新项目主要涉及新型环保树脂的研发与应用。联合化工研发团队历时三年，成功开发出具有自主知识产权的新一代环保树脂产品，其性能指标在同类产品中保持较高水平。

该创新产品在以下方面实现了重大突破：
- 挥发性有机化合物（VOC）含量降低80%以上
- 产品纯度达到99.9%，超越行业标准
- 生产能耗降低30%，实现绿色制造
- 产品应用范围扩大到航空航天等高端领域`,
      type: 'news',
      category: newsCategoryIds['company-news'],
      publish_date: '2024-11-10T00:00:00.000Z',
      is_published: true,
    },
    {
      title: '新一代汽车原厂漆树脂正式投产',
      excerpt: '我公司研发团队历时三年开发的新一代汽车原厂漆专用树脂正式投产，性能达到较高水平。',
      content: `江西联合化工有限公司研发团队历时三年开发的新一代汽车原厂漆专用树脂正式投产，标志着我国在汽车涂料领域实现了重大技术突破。

新一代汽车原厂漆树脂具有以下显著特点：
- 优异的耐候性和耐化学性
- 出色的附着力和柔韧性
- 低温固化性能优良
- 环保性能突出，符合欧盟REACH法规`,
      type: 'product',
      category: newsCategoryIds['product-release'],
      publish_date: '2024-11-08T00:00:00.000Z',
      is_published: true,
    },
    {
      title: '联合化工与欧洲知名企业达成战略合作',
      excerpt: '江西联合化工与德国巴斯夫公司签署战略合作协议，双方将在技术研发、市场拓展等领域开展深度合作。',
      content: `江西联合化工有限公司与德国巴斯夫公司在上海签署战略合作协议，双方将在技术研发、市场拓展等多个领域开展深度合作，共同开拓全球市场。

此次合作将聚焦高性能环保树脂的联合研发，双方将共享研发资源，共同推进新材料在汽车、电子等高端领域的应用。`,
      type: 'news',
      category: newsCategoryIds['company-news'],
      publish_date: '2024-11-05T00:00:00.000Z',
      is_published: true,
    },
  ]
  for (const n of newsDefs) {
    const existing = await payload.find({ collection: 'news', where: { title: { equals: n.title } }, limit: 1 })
    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'news',
        data: { ...n, content: textToLexical(n.content), tags: [] },
      })
    }
  }
  console.log('✓ 新闻', newsDefs.length, '条')

  // 6. 招聘
  const careerDefs = [
    {
      position: '树脂研发工程师',
      department: '研发部',
      location: '星火工业园',
      type: 'full_time',
      experience_requirement: '3-5年经验',
      description: '负责丙烯酸树脂、PP树脂、触变型树脂等产品的研发工作，特别是在汽车内外饰件和原厂漆应用领域的技术开发。',
      requirements: ['化工、高分子材料、应用化学等相关专业本科及以上学历', '3年以上树脂研发工作经验，熟悉汽车涂料行业者优先', '掌握树脂合成工艺和配方设计，能独立开展研发工作', '具备良好的沟通能力和团队协作精神'],
      responsibilities: ['负责丙烯酸树脂、聚酯树脂、氨基树脂等产品的配方开发', '针对汽车内外饰件和原厂漆应用进行树脂性能优化', '制定和实施新产品研发计划，完成项目开发任务', '编写产品技术文档、工艺文件和质量标准'],
      is_active: true,
    },
    {
      position: 'DCS控制工程师',
      department: '生产部',
      location: '星火工业园',
      type: 'full_time',
      experience_requirement: '2-4年经验',
      description: '负责DCS自动化控制系统的运行维护，确保生产设备安全稳定运行，优化生产工艺参数。',
      requirements: ['自动化、化工机械、过程控制等相关专业大专及以上学历', '2年以上DCS系统操作维护经验，熟悉化工生产工艺', '掌握DCS系统的硬件结构、软件配置和编程方法', '能适应倒班工作，具备良好的应急处理能力'],
      responsibilities: ['负责DCS系统的日常监控、操作和维护工作', '监控生产过程中的关键参数，及时调整工艺条件', '处理DCS系统故障和报警，确保生产安全稳定', '记录运行数据，编写技术报告和改进建议'],
      is_active: true,
    },
    {
      position: '涂料销售工程师',
      department: '销售部',
      location: '全国（华东、华南、华北）',
      type: 'full_time',
      experience_requirement: '2-3年经验',
      description: '负责公司在涂料行业的树脂产品销售，重点开发汽车原厂漆、工业漆等领域的客户资源。',
      requirements: ['化工、市场营销等相关专业大专及以上学历', '2年以上化工产品销售经验', '熟悉汽车涂料行业者优先', '能适应频繁出差'],
      responsibilities: ['开发并维护涂料行业客户资源', '制定销售计划并完成销售目标', '协调技术部门提供售前售后支持'],
      is_active: true,
    },
  ]
  for (const c of careerDefs) {
    const existing = await payload.find({ collection: 'careers', where: { position: { equals: c.position } }, limit: 1 })
    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'careers',
        data: {
          ...c,
          requirements: c.requirements.map((text: string) => ({ text })),
          responsibilities: c.responsibilities.map((text: string) => ({ text })),
          career_benefits: [],
        },
      })
    }
  }
  console.log('✓ 招聘', careerDefs.length, '条')

  // 7. 首页轮播
  const bannerDefs = [
    { title: '专业化工原料制造商', subtitle: '20年行业经验，为全球客户提供卓越化工解决方案', image_url: '/images/banners/hero-1.jpg', button_text: '了解更多', button_url: '/about', is_active: true, sort_order: 1 },
    { title: '创新化学科技，助力行业发展', subtitle: '专注树脂研发，性能达到较高水平', image_url: '/images/banners/hero-2.jpg', button_text: '查看产品', button_url: '/products', is_active: true, sort_order: 2 },
  ]
  for (const b of bannerDefs) {
    const existing = await payload.find({ collection: 'hero-banners', where: { title: { equals: b.title } }, limit: 1 })
    if (existing.docs.length === 0) {
      await payload.create({ collection: 'hero-banners', data: b })
    }
  }
  console.log('✓ 轮播', bannerDefs.length, '条')

  // 8. Globals（updateGlobal 自动创建单例）
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: '江西联合化工',
      siteTagline: '专业树脂制造商',
      footerDescription:
        '成立于2002年，专注化工树脂研发生产20余年，年产值达8亿元人民币，为全球客户提供高品质的化工产品解决方案。',
      qualityMark: 'ISO 9001',
      qualityDesc: '质量认证企业',
      icpNumber: '赣ICP备2020014627号-2',
      copyrightText: '© 2026 江西联合化学有限公司. 保留所有权利.',
      contact: {
        address: '江西省九江市永修县艾城镇',
        addressLine2: '星火工业园荣祺大道16号',
        zipCode: '330317',
        phone: '18162108792',
        fax: '0792-3053111',
        email: '1179002658@qq.com',
        techPhone: '18162108792',
      },
      legalLinks: [
        { label: '隐私政策', url: '#' },
        { label: '服务条款', url: '#' },
        { label: '网站地图', url: '#' },
        { label: '法律声明', url: '#' },
      ],
    },
  })
  console.log('✓ 站点设置 Global')

  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      items: [
        { label: '首页', href: '/', isActive: true },
        { label: '产品中心', href: '/products', isActive: true },
        { label: '关于我们', href: '/about', isActive: true },
        { label: '新闻中心', href: '/news', isActive: true },
        { label: '加入我们', href: '/careers', isActive: true },
        { label: '联系我们', href: '/contact', isActive: true },
      ],
    },
  })
  console.log('✓ 导航 Global')

  await payload.updateGlobal({
    slug: 'page-headers',
    data: {
      productsPage: { enabled: true, title: '产品中心', subtitle: '探索我们完整的化工产品系列，为各行业提供高品质的解决方案' },
      newsPage: { enabled: true, title: '新闻中心', subtitle: '关注江西联合化工最新动态，把握化工行业发展脉搏' },
      careersPage: { enabled: true, title: '加入我们', subtitle: '寻找志同道合的优秀人才，在江西联合化工开启您的职业新征程' },
      contactPage: { enabled: true, title: '联系我们', subtitle: '期待与您的合作与交流，我们将竭诚为您提供专业的化工产品解决方案' },
    },
  })
  console.log('✓ 页头 Global')

  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      hero: {
        enabled: true,
        title: '江西联合化工',
        subtitleLine1: '创新化学科技，助力行业发展。',
        subtitleLine2: '我们致力于提供卓越的化工解决方案，为全球客户创造持久价值。',
        bgImageUrl: '/uniche.png',
        primaryButtonText: '探索产品',
        primaryButtonHref: '/products',
        secondaryButtonText: '联系我们',
        secondaryButtonHref: '/contact',
        scrollText: '滚动探索',
      },
      showcase: {
        enabled: true,
        title: '我们的产品系列',
        subtitle: '精心研发的化工产品，为各行业提供可靠的解决方案',
        cards: [
          { title: '化工原料', description: '高品质基础化工原料，广泛应用于医药、电子、汽车等高端制造领域，为各行业提供稳定可靠的原料供应。', imageUrl: '/image1.png', href: '/products' },
          { title: '精细化学品', description: '专业化定制精细化学品，采用先进生产工艺，满足特定工业应用的精准需求，为客户提供定制化解决方案。', imageUrl: '/image2.png', href: '/products' },
          { title: '专用化学品', description: '创新配方专用化学品，结合行业经验与技术优势，为客户提供差异化的竞争优势和专业服务。', imageUrl: '/image1.png', href: '/products' },
        ],
        ctaText: '查看所有产品',
        ctaHref: '/products',
      },
      features: {
        enabled: true,
        title: '为什么选择江西联合化工',
        subtitle: '我们专注于品质、创新和服务，为客户创造持久价值',
        features: [
          { icon: 'check', title: '卓越品质', description: '通过ISO9001质量管理体系认证，严格把控从原料到成品的每一个环节' },
          { icon: 'bolt', title: '创新技术', description: '拥有50+项专利技术，持续投入研发，推动行业技术进步' },
          { icon: 'shield', title: '安全环保', description: '严格遵循EHS标准，绿色生产工艺，致力于可持续发展' },
          { icon: 'globe', title: '全球供应', description: '覆盖50+国家和地区的供应链网络，确保产品及时交付' },
          { icon: 'team', title: '专业团队', description: '200+专业技术人员，提供从咨询到售后的一站式服务' },
          { icon: 'spark', title: '定制方案', description: '深入理解客户需求，提供个性化的产品解决方案' },
        ],
      },
      factory: {
        enabled: true,
        title: '现代化生产基地',
        subtitle: '高标准的生产设施，确保产品质量与交付能力',
        imageUrl: '/uniche.png',
        overlayTitle: '智能化工园区',
        overlayText: '占地500亩的现代化生产基地，配备先进的生产设备和技术',
      },
      stats: {
        enabled: true,
        title: '我们的成就',
        subtitle: '数字见证我们20年来的专业与坚持',
        stats: [
          { number: '20+', label: '年行业经验' },
          { number: '500+', label: '合作伙伴' },
          { number: '1000+', label: '满意客户' },
          { number: '50+', label: '专利技术' },
        ],
      },
      cta: {
        enabled: true,
        title: '准备好开始合作了吗？',
        subtitle: '联系我们的专业团队，获取定制化的化工解决方案和技术支持',
        primaryButtonText: '立即联系',
        primaryButtonHref: '/contact',
        secondaryButtonText: '浏览产品',
        secondaryButtonHref: '/products',
      },
    },
  })
  console.log('✓ 首页 Global')

  await payload.updateGlobal({
    slug: 'about-page',
    data: {
      heroTitle: '关于我们',
      heroSubtitle: '了解江西联合化工的企业文化与发展历程，探索我们20年来的专业与创新',
      introGroup: {
        introTitle: '公司简介',
        introContent: textToLexical(
          '江西联合化工有限公司分别成立于2002年，总部设在国家级新型工业化产业示范基地——星火工业园。公司主要经营生产：丙烯酸树脂，PP树脂，触变型树脂，丙烯酸水分散体，聚酯树脂，氨基树脂，环氧磷酸酯，蜡分散体等。预计年产值可达8亿元人民币。\n\n' +
          '我司具有强大的研发团队，可以按照客户要求定制树脂，我司已跟跟国内外涂料厂建立合作。我司特别是在汽车内外饰件和原厂漆方面有大量的应用案例，这块积累了很多应用经验和成熟的案例。为客户解决难点和痛点，一直是联合人前进的方向。'
        ),
      },
      missionTitle: '公司使命',
      missionDescription: '通过提供高质量的化工产品和专业的技术服务，为客户创造价值，推动行业发展。',
      visionTitle: '公司愿景',
      visionDescription: '成为值得信赖的化工产品供应商，持续推动行业技术创新和可持续发展。',
      milestones: [
        { year: '2002', title: '公司成立', description: '江西联合化工有限公司正式成立，总部设在国家级新型工业化产业示范基地——星火工业园，专注树脂产品研发生产', badge: '创业启航', color: 'gold' },
        { year: '2005', title: '产品线完善', description: '形成完整的树脂产品体系：丙烯酸树脂、PP树脂、触变型树脂、丙烯酸水分散体、聚酯树脂、氨基树脂、环氧磷酸酯、蜡分散体等', badge: '产品矩阵', color: 'secondary' },
        { year: '2010', title: '技术突破', description: '建立强大研发团队，实现汽车内外饰件和原厂漆领域重大技术突破，积累大量成熟应用案例', badge: '技术创新', color: 'accent' },
        { year: '2015', title: '产业升级', description: '新建高标准厂房，引进DCS控制设备，建立完善的质量保证体系，实现年产值8亿元目标', badge: '产能升级', color: 'gold' },
        { year: '2020', title: '市场拓展', description: '与国内外知名涂料厂建立深度合作，定制化树脂服务能力显著提升，客户满意度持续提高', badge: '合作共赢', color: 'accent' },
      ],
      stats: [
        { number: '20+', label: '年行业经验' },
        { number: '8亿', label: '年产值(元)' },
        { number: '8+', label: '产品系列' },
      ],
      rdTitle: '研发与技术',
      rdCards: [
        { icon: 'flask', title: '技术研发', description: '拥有专业的研发团队，不断开发新产品，提升技术水平。' },
        { icon: 'shield', title: '质量认证', description: '通过多项国际质量认证，确保产品质量稳定可靠，符合国家及行业标准。' },
        { icon: 'team', title: '专家团队', description: '汇聚国内外化工领域资深专家，为产品研发提供强大支持。' },
      ],
    },
  })
  console.log('✓ 关于我们 Global')

  await payload.updateGlobal({
    slug: 'contact-page',
    data: {
      formTitle: '发送消息',
      infoTitle: '联系方式',
      mapTitle: '地理位置',
      mapDescription: '江西联合化工有限公司位于国家级新型工业化产业示范基地——星火工业园，交通便利，配套设施完善',
    },
  })
  console.log('✓ 联系页 Global')

  console.log('🎉 Payload 数据 seed 完成！')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
