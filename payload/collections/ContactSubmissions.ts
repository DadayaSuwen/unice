import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'name',
    group: '客服',
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: '姓名' },
    { name: 'email', type: 'email', required: true, label: '邮箱' },
    { name: 'phone', type: 'text', label: '电话' },
    { name: 'company', type: 'text', label: '公司' },
    { name: 'message', type: 'textarea', required: true, label: '留言内容' },
    { name: 'ip_address', type: 'text', label: 'IP 地址' },
    { name: 'user_agent', type: 'text', label: 'User Agent' },
    { name: 'is_read', type: 'checkbox', defaultValue: false, label: '已读' },
  ],
  access: {
    create: () => true,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
}
