import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const Careers: CollectionConfig = {
  slug: 'careers',
  labels: {
    singular: '招聘职位',
    plural: '招聘职位',
  },
  admin: {
    useAsTitle: 'position',
    group: '招聘',
  },
  fields: [
    { name: 'position', type: 'text', required: true, label: '职位名称' },
    { name: 'department', type: 'text', label: '部门' },
    { name: 'location', type: 'text', label: '工作地点' },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'full_time',
      label: '职位类型',
      options: [
        { label: '全职', value: 'full_time' },
        { label: '兼职', value: 'part_time' },
        { label: '合同工', value: 'contract' },
        { label: '实习', value: 'internship' },
        { label: '远程', value: 'remote' },
      ],
    },
    { name: 'experience_requirement', type: 'text', label: '经验要求' },
    { name: 'description', type: 'textarea', label: '职位描述' },
    {
      name: 'requirements',
      type: 'array',
      label: '任职要求',
      fields: [{ name: 'text', type: 'text' }],
    },
    {
      name: 'responsibilities',
      type: 'array',
      label: '岗位职责',
      fields: [{ name: 'text', type: 'text' }],
    },
    { name: 'application_deadline', type: 'date', label: '申请截止日期' },
    { name: 'salary_range', type: 'text', label: '薪资范围' },
    { name: 'education_requirement', type: 'text', label: '学历要求' },
    { name: 'work_environment', type: 'textarea', label: '工作环境' },
    {
      name: 'career_benefits',
      type: 'array',
      label: '职业福利',
      fields: [{ name: 'text', type: 'text' }],
    },
    { name: 'contact_email', type: 'email', label: '联系邮箱' },
    { name: 'contact_phone', type: 'text', label: '联系电话' },
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
