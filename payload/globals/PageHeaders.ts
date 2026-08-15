import type { Field, GlobalConfig } from 'payload'
import { isAdminOrEditor } from '../access'
import { seoFields } from '../fields/seo'

const pageHeaderGroup = (key: string, label: string): Field => ({
  name: key,
  type: 'group' as const,
  label,
  fields: [
    { name: 'enabled', type: 'checkbox', defaultValue: true, label: '启用页头' },
    { name: 'title', type: 'text', label: '页头标题' },
    { name: 'subtitle', type: 'textarea', label: '页头副标题' },
  ],
})

export const PageHeaders: GlobalConfig = {
  slug: 'page-headers',
  label: '页面页头',
  admin: {
    group: '网站设置',
    description: '产品/新闻/招聘/联系等列表页的页头横幅文案',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    pageHeaderGroup('productsPage', '产品中心页头'),
    pageHeaderGroup('newsPage', '新闻中心页头'),
    pageHeaderGroup('careersPage', '加入我们页头'),
    pageHeaderGroup('contactPage', '联系我们页头'),
    ...seoFields,
  ],
}
