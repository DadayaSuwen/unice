import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: '产品',
    plural: '产品',
  },
  admin: {
    useAsTitle: 'name',
    group: '产品',
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: '产品名称' },
    { name: 'cas_no', type: 'text', label: 'CAS 号' },
    { name: 'category', type: 'relationship', relationTo: 'categories', label: '产品分类' },
    { name: 'description', type: 'textarea', label: '产品描述' },
    { name: 'details', type: 'json', label: '详细参数', admin: { description: '对象：外观/固含量/粘度等' } },
    { name: 'image_url', type: 'text', label: '图片 URL' },
    { name: 'features', type: 'json', label: '产品特性', admin: { description: '字符串数组' } },
    { name: 'applications', type: 'json', label: '应用领域', admin: { description: '数组 [{name, description}]' } },
    { name: 'safety_info', type: 'json', label: '安全信息', admin: { description: '对象：危险性/储存条件等' } },
    { name: 'is_active', type: 'checkbox', defaultValue: true, label: '启用' },
  ],
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
}
