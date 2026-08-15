import { htmlToText, lexicalToHtml, lexicalToPlaintext } from './lexical'

export function relToId(rel: unknown): number | undefined {
  if (typeof rel === 'number') return rel
  if (rel && typeof rel === 'object') return (rel as { id?: number }).id
  return undefined
}

export function relToName(rel: unknown): string | undefined {
  if (rel && typeof rel === 'object') return (rel as { name?: string }).name
  return undefined
}

export function mapProduct(p: any) {
  return {
    id: p.id,
    name: p.name,
    cas_no: p.cas_no ?? undefined,
    category_id: relToId(p.category),
    description: p.description ?? undefined,
    details: p.details ?? null,
    image_url: p.image_url ?? undefined,
    created_at: p.createdAt ? new Date(p.createdAt) : undefined,
    updated_at: p.updatedAt ? new Date(p.updatedAt) : undefined,
    is_active: p.is_active,
    category: p.category ? { name: relToName(p.category) ?? '' } : undefined,
  }
}

export function mapNews(n: any) {
  const html = lexicalToHtml(n.content)
  const text = lexicalToPlaintext(n.content) || htmlToText(html)
  return {
    id: n.id,
    title: n.title,
    excerpt:
      n.excerpt || (text ? `${text.substring(0, 120)}${text.length > 120 ? '...' : ''}` : ''),
    content: html,
    type: getNewsTypeLabel(n.type),
    publish_date: n.publish_date,
    author: n.author || '江西联合化工',
    image_url: n.image_url,
    tags: (n.tags || []).map((t: any) => t.tag),
    read_time: n.read_time || (text ? Math.ceil(text.length / 500) : 3),
    views_count: n.views_count || 0,
    category: relToName(n.category) || getNewsCategory(n.type),
    category_id: relToId(n.category),
    featured: n.featured || false,
  }
}

export function getNewsTypeLabel(type?: string): string {
  const map: Record<string, string> = {
    news: '公司新闻',
    industry: '行业资讯',
    product: '产品发布',
    event: '企业活动',
    tech: '技术创新',
    responsibility: '社会责任',
  }
  return map[type || ''] || '新闻'
}

export function getNewsCategory(type?: string): string {
  const map: Record<string, string> = {
    news: '公司新闻',
    industry: '行业资讯',
    product: '产品发布',
    event: '企业活动',
    tech: '技术创新',
    responsibility: '社会责任',
  }
  return map[type || ''] || '公司新闻'
}
