import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '../access'
import { seoFields } from '../fields/seo'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: '联系页内容',
  admin: {
    group: '联系我们',
    description: '联系页表单/联系信息/地图区块标题',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    { name: 'formTitle', type: 'text', label: '表单区块标题', defaultValue: '发送消息' },
    { name: 'infoTitle', type: 'text', label: '联系信息标题', defaultValue: '联系方式' },
    { name: 'mapTitle', type: 'text', label: '地图区块标题', defaultValue: '地理位置' },
    { name: 'mapDescription', type: 'textarea', label: '地图区块描述' },
    ...seoFields,
  ],
}
