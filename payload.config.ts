import path from 'path'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { zh } from '@payloadcms/translations/languages/zh'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Users } from './payload/collections/Users'
import { Media } from './payload/collections/Media'
import { Categories } from './payload/collections/Categories'
import { Products } from './payload/collections/Products'
import { NewsCategories } from './payload/collections/NewsCategories'
import { News } from './payload/collections/News'
import { Careers } from './payload/collections/Careers'
import { HeroBanners } from './payload/collections/HeroBanners'
import { ContactSubmissions } from './payload/collections/ContactSubmissions'
import { SiteSettings } from './payload/globals/SiteSettings'
import { Navigation } from './payload/globals/Navigation'
import { PageHeaders } from './payload/globals/PageHeaders'
import { HomePage } from './payload/globals/HomePage'
import { AboutPage } from './payload/globals/AboutPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '· 联合化工管理后台',
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Products,
    NewsCategories,
    News,
    Careers,
    HeroBanners,
    ContactSubmissions,
  ],
  editor: lexicalEditor(),
  globals: [SiteSettings, Navigation, PageHeaders, HomePage, AboutPage],
  i18n: {
    fallbackLanguage: 'zh',
    supportedLanguages: {
      zh,
    },
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, '.payload/types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || '',
    },
  }),
})
