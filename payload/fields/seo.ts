import type { Field } from 'payload'

/**
 * 全站统一的 SEO 字段组。字段名由前台 app/lib/globals.ts 的 seoToMetadata() 消费。
 */
export const seoFields: Field[] = [
  {
    name: 'seo',
    type: 'group',
    label: 'SEO 优化',
    admin: {
      description: '留空时前台自动回退到默认文案',
    },
    fields: [
      { name: 'metaTitle', type: 'text', label: 'SEO 标题' },
      { name: 'metaDescription', type: 'textarea', label: 'SEO 描述' },
      {
        name: 'keywords',
        type: 'text',
        label: '关键词',
        admin: { description: '多个关键词用英文逗号分隔' },
      },
      {
        name: 'ogImage',
        type: 'upload',
        relationTo: 'media',
        label: '分享图 (OG Image)',
      },
      { name: 'canonical', type: 'text', label: 'Canonical URL' },
      { name: 'noindex', type: 'checkbox', defaultValue: false, label: '禁止收录 (noindex)' },
    ],
  },
]
