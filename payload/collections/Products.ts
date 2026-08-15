import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'
import { richTextEditor } from '../editor'
import { seoFields } from '../fields/seo'

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
    {
      name: 'summary',
      type: 'textarea',
      label: '产品简介（列表卡片）',
      admin: { description: '在产品列表/首页卡片上显示的简短介绍' },
    },
    {
      name: 'description',
      type: 'richText',
      editor: richTextEditor(),
      label: '产品描述（富文本）',
    },
    {
      name: 'details',
      type: 'array',
      label: '技术指标',
      admin: { description: '逐行填写：指标名 + 指标值' },
      fields: [
        { name: 'name', type: 'text', label: '指标名（如：外观）' },
        { name: 'value', type: 'text', label: '指标值（如：无色透明液体）' },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: '产品特性',
      fields: [{ name: 'text', type: 'text', label: '特性描述' }],
    },
    {
      name: 'applications',
      type: 'array',
      label: '应用领域',
      fields: [
        { name: 'name', type: 'text', label: '领域名称' },
        { name: 'description', type: 'textarea', label: '描述' },
      ],
    },
    {
      name: 'safety_info',
      type: 'array',
      label: '安全信息',
      fields: [
        { name: 'title', type: 'text', label: '标题（如：储存条件）' },
        { name: 'content', type: 'textarea', label: '内容' },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: '产品图片' },
    {
      name: 'image_url',
      type: 'text',
      label: '图片 URL（兜底）',
      admin: { description: '未上传图片时使用' },
    },
    { name: 'is_active', type: 'checkbox', defaultValue: true, label: '启用' },
    ...seoFields,
  ],
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
}
