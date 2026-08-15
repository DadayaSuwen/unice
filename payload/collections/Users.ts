import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: '管理员',
    plural: '管理员',
  },
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: '系统',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      label: '角色',
      defaultValue: 'editor',
      required: true,
      options: [
        { label: '管理员', value: 'admin' },
        { label: '编辑', value: 'editor' },
      ],
    },
    {
      name: 'displayName',
      type: 'text',
      label: '显示名称',
    },
  ],
}
