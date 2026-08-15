import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '../access'
import { seoFields } from '../fields/seo'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: '站点设置',
  admin: {
    group: '网站设置',
    description: '全站通用信息：站点名、Logo、页脚、联系方式、SEO 默认值',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'siteName', type: 'text', label: '站点名称', defaultValue: '江西联合化工' },
        { name: 'siteTagline', type: 'text', label: '副标语', defaultValue: '专业树脂制造商' },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      admin: { description: '未上传时前台回退到 /logo.jpg' },
    },
    { name: 'footerDescription', type: 'textarea', label: '页脚简介' },
    {
      type: 'row',
      fields: [
        { name: 'qualityMark', type: 'text', label: '质量认证标识', defaultValue: 'ISO 9001' },
        { name: 'qualityDesc', type: 'text', label: '质量认证说明', defaultValue: '质量认证企业' },
      ],
    },
    { name: 'icpNumber', type: 'text', label: 'ICP 备案号' },
    { name: 'copyrightText', type: 'text', label: '版权文案' },
    {
      name: 'contact',
      type: 'group',
      label: '联系方式',
      fields: [
        { name: 'address', type: 'text', label: '公司地址' },
        { name: 'addressLine2', type: 'text', label: '地址第二行' },
        { name: 'zipCode', type: 'text', label: '邮编' },
        { name: 'phone', type: 'text', label: '电话' },
        { name: 'fax', type: 'text', label: '传真' },
        { name: 'email', type: 'text', label: '邮箱' },
        { name: 'techPhone', type: 'text', label: '技术支持电话' },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: '社交链接',
      fields: [
        { name: 'label', type: 'text', label: '名称' },
        { name: 'url', type: 'text', label: '链接' },
      ],
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: '法律链接（页脚底部）',
      fields: [
        { name: 'label', type: 'text', label: '名称' },
        { name: 'url', type: 'text', label: '链接' },
      ],
    },
    {
      name: 'headScripts',
      type: 'textarea',
      label: '自定义脚本（<head>）',
      admin: { description: '如统计代码，将原样注入站点 <head>' },
    },
    ...seoFields,
  ],
}
