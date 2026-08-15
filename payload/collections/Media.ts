import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: '媒体文件',
    plural: '媒体文件',
  },
  admin: {
    group: '媒体',
  },
  upload: {
    // 对应 Docker 卷 ./uploads:/app/uploads
    staticDir: 'uploads',
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
    ],
  },
  fields: [
    { name: 'alt', type: 'text', label: '替代文本 (Alt)' },
  ],
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
}
