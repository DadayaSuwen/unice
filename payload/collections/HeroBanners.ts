import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const HeroBanners: CollectionConfig = {
  slug: 'hero-banners',
  labels: {
    singular: '首页轮播',
    plural: '首页轮播',
  },
  admin: {
    useAsTitle: 'title',
    group: '首页',
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: '主标题' },
    { name: 'subtitle', type: 'text', label: '副标题' },
    { name: 'image_url', type: 'text', label: '图片 URL' },
    { name: 'button_text', type: 'text', label: '按钮文字' },
    { name: 'button_url', type: 'text', label: '按钮链接' },
    { name: 'is_active', type: 'checkbox', defaultValue: true, label: '启用' },
    { name: 'sort_order', type: 'number', defaultValue: 0, label: '排序' },
  ],
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
}
