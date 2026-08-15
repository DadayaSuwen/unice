import type { GlobalConfig } from 'payload'
import { isAdminOrEditor } from '../access'
import { richTextEditor } from '../editor'
import { seoFields } from '../fields/seo'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: '关于我们',
  admin: {
    group: '关于我们',
    description: '公司简介、使命愿景、发展历程、研发与技术',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    { name: 'heroTitle', type: 'text', label: '页头标题' },
    { name: 'heroSubtitle', type: 'textarea', label: '页头副标题' },
    {
      name: 'introGroup',
      type: 'group',
      label: '公司简介',
      fields: [
        { name: 'introTitle', type: 'text', label: '标题' },
        { name: 'introContent', type: 'richText', editor: richTextEditor(), label: '简介正文（富文本）' },
        { name: 'introImage', type: 'upload', relationTo: 'media', label: '配图' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'missionTitle', type: 'text', label: '使命标题', defaultValue: '公司使命' },
        { name: 'visionTitle', type: 'text', label: '愿景标题', defaultValue: '公司愿景' },
      ],
    },
    { name: 'missionDescription', type: 'textarea', label: '使命描述' },
    { name: 'visionDescription', type: 'textarea', label: '愿景描述' },
    {
      name: 'milestones',
      type: 'array',
      label: '发展历程时间线',
      fields: [
        { name: 'year', type: 'text', label: '年份' },
        { name: 'title', type: 'text', label: '标题' },
        { name: 'description', type: 'textarea', label: '描述' },
        { name: 'badge', type: 'text', label: '徽章文字' },
        {
          name: 'color',
          type: 'select',
          defaultValue: 'gold',
          options: [
            { label: '金色', value: 'gold' },
            { label: '蓝色', value: 'secondary' },
            { label: '紫色', value: 'accent' },
          ],
          label: '配色',
        },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      label: '统计数据',
      fields: [
        { name: 'number', type: 'text', label: '数值' },
        { name: 'label', type: 'text', label: '标签' },
      ],
    },
    { name: 'rdTitle', type: 'text', label: '研发技术区标题', defaultValue: '研发与技术' },
    {
      name: 'rdCards',
      type: 'array',
      label: '研发技术卡片',
      fields: [
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: '对勾', value: 'check' },
            { label: '闪电', value: 'bolt' },
            { label: '盾牌', value: 'shield' },
            { label: '地球', value: 'globe' },
            { label: '团队', value: 'team' },
            { label: '星光', value: 'spark' },
            { label: '烧瓶', value: 'flask' },
            { label: '工厂', value: 'factory' },
          ],
          label: '图标',
        },
        { name: 'title', type: 'text', label: '标题' },
        { name: 'description', type: 'textarea', label: '描述' },
      ],
    },
    ...seoFields,
  ],
}
