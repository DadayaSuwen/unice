import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { isAdminOrEditor } from '../access'

export const News: CollectionConfig = {
  slug: 'news',
  labels: {
    singular: '新闻',
    plural: '新闻',
  },
  admin: {
    useAsTitle: 'title',
    group: '新闻',
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: '标题' },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
      label: '正文',
    },
    { name: 'excerpt', type: 'textarea', label: '摘要' },
    { name: 'type', type: 'text', defaultValue: 'news', label: '类型', admin: { description: '如 news / industry / product / event / tech' } },
    { name: 'publish_date', type: 'date', label: '发布日期' },
    { name: 'is_published', type: 'checkbox', defaultValue: true, label: '已发布' },
    { name: 'author', type: 'text', label: '作者' },
    { name: 'image_url', type: 'text', label: '图片 URL' },
    {
      name: 'tags',
      type: 'array',
      label: '标签',
      fields: [{ name: 'tag', type: 'text' }],
    },
    { name: 'read_time', type: 'number', label: '阅读时间（分钟）' },
    { name: 'views_count', type: 'number', defaultValue: 0, label: '浏览次数' },
    { name: 'category', type: 'relationship', relationTo: 'news-categories', label: '新闻分类' },
    { name: 'seo_title', type: 'text', label: 'SEO 标题' },
    { name: 'seo_description', type: 'textarea', label: 'SEO 描述' },
    { name: 'featured', type: 'checkbox', defaultValue: false, label: '精选' },
    { name: 'sort_order', type: 'number', defaultValue: 0, label: '排序' },
  ],
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
}
