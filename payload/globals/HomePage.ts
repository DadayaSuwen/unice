import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '../access'
import { seoFields } from '../fields/seo'

const iconOptions = [
  { label: '对勾', value: 'check' },
  { label: '闪电', value: 'bolt' },
  { label: '盾牌', value: 'shield' },
  { label: '地球', value: 'globe' },
  { label: '团队', value: 'team' },
  { label: '星光', value: 'spark' },
  { label: '烧瓶', value: 'flask' },
  { label: '工厂', value: 'factory' },
  { label: '目标', value: 'target' },
  { label: '方块', value: 'layers' },
]

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: '首页内容',
  admin: {
    group: '首页',
    description: '首页六大板块：Hero / 产品展示 / 特性 / 生产基地 / 数据统计 / CTA',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: '① Hero 横幅',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true, label: '启用' },
        { name: 'title', type: 'text', label: '主标题' },
        { name: 'subtitleLine1', type: 'text', label: '副标题第一行' },
        { name: 'subtitleLine2', type: 'text', label: '副标题第二行' },
        { name: 'bgImage', type: 'upload', relationTo: 'media', label: '背景图' },
        { name: 'bgImageUrl', type: 'text', label: '背景图 URL（兜底）' },
        { name: 'primaryButtonText', type: 'text', label: '主按钮文字' },
        { name: 'primaryButtonHref', type: 'text', label: '主按钮链接' },
        { name: 'secondaryButtonText', type: 'text', label: '次按钮文字' },
        { name: 'secondaryButtonHref', type: 'text', label: '次按钮链接' },
        { name: 'scrollText', type: 'text', label: '滚动提示文字' },
      ],
    },
    {
      name: 'showcase',
      type: 'group',
      label: '② 产品展示区',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true, label: '启用' },
        { name: 'title', type: 'text', label: '区块标题' },
        { name: 'subtitle', type: 'text', label: '区块副标题' },
        {
          name: 'cards',
          type: 'array',
          label: '展示卡片（建议 3 个）',
          fields: [
            { name: 'title', type: 'text', label: '标题' },
            { name: 'description', type: 'textarea', label: '描述' },
            { name: 'image', type: 'upload', relationTo: 'media', label: '图片' },
            { name: 'imageUrl', type: 'text', label: '图片 URL（兜底）' },
            { name: 'href', type: 'text', label: '链接', defaultValue: '/products' },
          ],
        },
        { name: 'ctaText', type: 'text', label: '底部按钮文字' },
        { name: 'ctaHref', type: 'text', label: '底部按钮链接', defaultValue: '/products' },
      ],
    },
    {
      name: 'features',
      type: 'group',
      label: '③ 特性区（为什么选择我们）',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true, label: '启用' },
        { name: 'title', type: 'text', label: '区块标题' },
        { name: 'subtitle', type: 'text', label: '区块副标题' },
        {
          name: 'features',
          type: 'array',
          label: '特性卡片',
          fields: [
            { name: 'icon', type: 'select', options: iconOptions, label: '图标' },
            { name: 'title', type: 'text', label: '标题' },
            { name: 'description', type: 'textarea', label: '描述' },
          ],
        },
      ],
    },
    {
      name: 'factory',
      type: 'group',
      label: '④ 生产基地展示',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true, label: '启用' },
        { name: 'title', type: 'text', label: '区块标题' },
        { name: 'subtitle', type: 'text', label: '区块副标题' },
        { name: 'image', type: 'upload', relationTo: 'media', label: '大图' },
        { name: 'imageUrl', type: 'text', label: '大图 URL（兜底）' },
        { name: 'overlayTitle', type: 'text', label: '图上标题' },
        { name: 'overlayText', type: 'text', label: '图上描述' },
      ],
    },
    {
      name: 'stats',
      type: 'group',
      label: '⑤ 数据统计区',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true, label: '启用' },
        { name: 'title', type: 'text', label: '区块标题' },
        { name: 'subtitle', type: 'text', label: '区块副标题' },
        {
          name: 'stats',
          type: 'array',
          label: '统计项',
          fields: [
            { name: 'number', type: 'text', label: '数值（如 20+）' },
            { name: 'label', type: 'text', label: '标签' },
          ],
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: '⑥ CTA 区',
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: true, label: '启用' },
        { name: 'title', type: 'text', label: '标题' },
        { name: 'subtitle', type: 'text', label: '副标题' },
        { name: 'primaryButtonText', type: 'text', label: '主按钮文字' },
        { name: 'primaryButtonHref', type: 'text', label: '主按钮链接' },
        { name: 'secondaryButtonText', type: 'text', label: '次按钮文字' },
        { name: 'secondaryButtonHref', type: 'text', label: '次按钮链接' },
      ],
    },
    ...seoFields,
  ],
}
