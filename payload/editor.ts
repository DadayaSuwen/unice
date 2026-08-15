import { lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  TextStateFeature,
} from '@payloadcms/richtext-lexical'

/**
 * 全站统一富文本编辑器。
 * 默认已含：粗斜体/下划线/删除线/上下标/内联代码/标题/对齐/缩进/
 * 有序无序清单/待办清单/链接/关系/引用/上传/分割线/浮动工具栏。
 * 在此之上额外启用：固定工具栏、表格、文字颜色。
 */
export const richTextEditor = () =>
  lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      EXPERIMENTAL_TableFeature(),
      TextStateFeature(),
    ],
  })
