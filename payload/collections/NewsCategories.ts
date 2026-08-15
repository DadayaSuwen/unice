import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const NewsCategories: CollectionConfig = {
  slug: 'news-categories',
  labels: {
    singular: '新闻分类',
    plural: '新闻分类',
  },
  admin: {
    useAsTitle: 'name',
    group: '新闻',
  },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true, label: '分类名称' },
    { name: 'slug', type: 'text', required: true, unique: true, label: 'Slug', admin: { description: '如 company-news' } },
    { name: 'description', type: 'textarea', label: '描述' },
    { name: 'color', type: 'text', label: '分类颜色', admin: { description: '如 #d4af37' } },
    { name: 'sort_order', type: 'number', defaultValue: 0, label: '排序' },
    { name: 'is_active', type: 'checkbox', defaultValue: true, label: '启用' },
  ],
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
}
