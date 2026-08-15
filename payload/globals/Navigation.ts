import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: '导航菜单',
  admin: {
    group: '网站设置',
    description: '顶部导航菜单项，桌面与移动端共用',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: '菜单项',
      fields: [
        { name: 'label', type: 'text', required: true, label: '名称' },
        { name: 'href', type: 'text', required: true, label: '链接' },
        { name: 'isActive', type: 'checkbox', defaultValue: true, label: '启用' },
      ],
    },
  ],
}
