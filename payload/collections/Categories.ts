import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    group: '产品',
  },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true, label: '分类名称' },
    { name: 'slug', type: 'text', required: true, unique: true, label: 'Slug', admin: { description: 'URL 标识，如 thermoplastic-resins' } },
    { name: 'description', type: 'textarea', label: '描述' },
    { name: 'parent', type: 'relationship', relationTo: 'categories', label: '父分类' },
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
