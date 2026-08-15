import type { Metadata } from 'next'
import { getPayloadClient } from './payload'
import { lexicalToHtml } from './lexical'

// ---------- 类型定义 ----------

export interface NavItem {
  label: string
  href: string
}

export interface ContactSettings {
  address: string
  addressLine2: string
  zipCode: string
  phone: string
  fax: string
  email: string
  techPhone: string
}

export interface SiteSettings {
  siteName: string
  siteTagline: string
  logoUrl: string
  footerDescription: string
  qualityMark: string
  qualityDesc: string
  icpNumber: string
  copyrightText: string
  contact: ContactSettings
  socialLinks: { label: string; url: string }[]
  legalLinks: { label: string; url: string }[]
  seo: { metaTitle?: string; metaDescription?: string; keywords?: string; canonical?: string; noindex?: boolean }
}

export interface PageHeader {
  enabled: boolean
  title: string
  subtitle: string
}

export interface PageHeadersData {
  productsPage: PageHeader
  newsPage: PageHeader
  careersPage: PageHeader
  contactPage: PageHeader
}

export interface HomeHero {
  enabled: boolean
  title: string
  subtitleLine1: string
  subtitleLine2: string
  bgImageUrl: string
  primaryButtonText: string
  primaryButtonHref: string
  secondaryButtonText: string
  secondaryButtonHref: string
  scrollText: string
}

export interface HomeShowcaseCard {
  title: string
  description: string
  imageUrl: string
  href: string
}

export interface HomeShowcaseSection {
  enabled: boolean
  title: string
  subtitle: string
  cards: HomeShowcaseCard[]
  ctaText: string
  ctaHref: string
}

export interface HomeFeature {
  icon: string
  title: string
  description: string
}

export interface HomeFeaturesSection {
  enabled: boolean
  title: string
  subtitle: string
  features: HomeFeature[]
}

export interface HomeFactorySection {
  enabled: boolean
  title: string
  subtitle: string
  imageUrl: string
  overlayTitle: string
  overlayText: string
}

export interface HomeStat {
  number: string
  label: string
}

export interface HomeStatsSection {
  enabled: boolean
  title: string
  subtitle: string
  stats: HomeStat[]
}

export interface HomeCtaSection {
  enabled: boolean
  title: string
  subtitle: string
  primaryButtonText: string
  primaryButtonHref: string
  secondaryButtonText: string
  secondaryButtonHref: string
}

export interface HomePageData {
  hero: HomeHero
  showcase: HomeShowcaseSection
  features: HomeFeaturesSection
  factory: HomeFactorySection
  stats: HomeStatsSection
  cta: HomeCtaSection
}

export type MilestoneColor = 'gold' | 'secondary' | 'accent'

export interface AboutMilestone {
  year: string
  title: string
  description: string
  badge: string
  color: MilestoneColor
}

export interface AboutPageData {
  heroTitle: string
  heroSubtitle: string
  introTitle: string
  introHtml: string
  introImageUrl: string
  missionTitle: string
  missionDescription: string
  visionTitle: string
  visionDescription: string
  milestones: AboutMilestone[]
  stats: { number: string; label: string }[]
  rdTitle: string
  rdCards: { icon: string; title: string; description: string }[]
}

export interface ContactPageData {
  formTitle: string
  infoTitle: string
  mapTitle: string
  mapDescription: string
}

// ---------- 兜底默认值（与当前硬编码完全一致） ----------

export const FALLBACK_NAV_ITEMS: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '产品中心', href: '/products' },
  { label: '关于我们', href: '/about' },
  { label: '新闻中心', href: '/news' },
  { label: '加入我们', href: '/careers' },
  { label: '联系我们', href: '/contact' },
]

export const FALLBACK_SITE_SETTINGS: SiteSettings = {
  siteName: '江西联合化工',
  siteTagline: '专业树脂制造商',
  logoUrl: '/logo.jpg',
  footerDescription:
    '成立于2002年，专注化工树脂研发生产20余年，年产值达8亿元人民币，为全球客户提供高品质的化工产品解决方案。',
  qualityMark: 'ISO 9001',
  qualityDesc: '质量认证企业',
  icpNumber: '赣ICP备2020014627号-2',
  copyrightText: '© 2026 江西联合化学有限公司. 保留所有权利.',
  contact: {
    address: '江西省九江市永修县艾城镇',
    addressLine2: '星火工业园荣祺大道16号',
    zipCode: '330317',
    phone: '18162108792',
    fax: '0792-3053111',
    email: '1179002658@qq.com',
    techPhone: '18162108792',
  },
  socialLinks: [],
  legalLinks: [
    { label: '隐私政策', url: '#' },
    { label: '服务条款', url: '#' },
    { label: '网站地图', url: '#' },
    { label: '法律声明', url: '#' },
  ],
  seo: {},
}

export const FALLBACK_PAGE_HEADERS: PageHeadersData = {
  productsPage: {
    enabled: true,
    title: '产品中心',
    subtitle: '探索我们完整的化工产品系列，为各行业提供高品质的解决方案',
  },
  newsPage: {
    enabled: true,
    title: '新闻中心',
    subtitle: '关注江西联合化工最新动态，把握化工行业发展脉搏',
  },
  careersPage: {
    enabled: true,
    title: '加入我们',
    subtitle: '寻找志同道合的优秀人才，在江西联合化工开启您的职业新征程',
  },
  contactPage: {
    enabled: true,
    title: '联系我们',
    subtitle: '期待与您的合作与交流，我们将竭诚为您提供专业的化工产品解决方案',
  },
}

export const FALLBACK_HOME_PAGE: HomePageData = {
  hero: {
    enabled: true,
    title: '江西联合化工',
    subtitleLine1: '创新化学科技，引领行业未来。',
    subtitleLine2: '我们致力于提供卓越的化工解决方案，为全球客户创造持久价值。',
    bgImageUrl: '/uniche.png',
    primaryButtonText: '探索产品',
    primaryButtonHref: '/products',
    secondaryButtonText: '联系我们',
    secondaryButtonHref: '/contact',
    scrollText: '滚动探索',
  },
  showcase: {
    enabled: true,
    title: '我们的产品系列',
    subtitle: '精心研发的化工产品，为各行业提供可靠的解决方案',
    cards: [
      {
        title: '化工原料',
        description:
          '高品质基础化工原料，广泛应用于医药、电子、汽车等高端制造领域，为各行业提供稳定可靠的原料供应。',
        imageUrl: '/image1.png',
        href: '/products',
      },
      {
        title: '精细化学品',
        description:
          '专业化定制精细化学品，采用先进生产工艺，满足特定工业应用的精准需求，为客户提供定制化解决方案。',
        imageUrl: '/image2.png',
        href: '/products',
      },
      {
        title: '专用化学品',
        description:
          '创新配方专用化学品，结合行业经验与技术优势，为客户提供差异化的竞争优势和专业服务。',
        imageUrl: '/image1.png',
        href: '/products',
      },
    ],
    ctaText: '查看所有产品',
    ctaHref: '/products',
  },
  features: {
    enabled: true,
    title: '为什么选择江西联合化工',
    subtitle: '我们专注于品质、创新和服务，为客户创造持久价值',
    features: [
      { icon: 'check', title: '卓越品质', description: '通过ISO9001质量管理体系认证，严格把控从原料到成品的每一个环节' },
      { icon: 'bolt', title: '创新技术', description: '拥有50+项专利技术，持续投入研发，引领行业技术发展方向' },
      { icon: 'shield', title: '安全环保', description: '严格遵循EHS标准，绿色生产工艺，致力于可持续发展' },
      { icon: 'globe', title: '全球供应', description: '覆盖50+国家和地区的供应链网络，确保产品及时交付' },
      { icon: 'team', title: '专业团队', description: '200+专业技术人员，提供从咨询到售后的一站式服务' },
      { icon: 'spark', title: '定制方案', description: '深入理解客户需求，提供个性化的产品解决方案' },
    ],
  },
  factory: {
    enabled: true,
    title: '现代化生产基地',
    subtitle: '世界一流的生产设施，确保产品质量与交付能力',
    imageUrl: '/uniche.png',
    overlayTitle: '智能化工园区',
    overlayText: '占地500亩的现代化生产基地，配备最先进的生产设备和技术',
  },
  stats: {
    enabled: true,
    title: '我们的成就',
    subtitle: '数字见证我们20年来的专业与坚持',
    stats: [
      { number: '20+', label: '年行业经验' },
      { number: '500+', label: '合作伙伴' },
      { number: '1000+', label: '满意客户' },
      { number: '50+', label: '专利技术' },
    ],
  },
  cta: {
    enabled: true,
    title: '准备好开始合作了吗？',
    subtitle: '联系我们的专业团队，获取定制化的化工解决方案和技术支持',
    primaryButtonText: '立即联系',
    primaryButtonHref: '/contact',
    secondaryButtonText: '浏览产品',
    secondaryButtonHref: '/products',
  },
}

export const FALLBACK_ABOUT_PAGE: AboutPageData = {
  heroTitle: '关于我们',
  heroSubtitle: '了解江西联合化工的企业文化与发展历程，探索我们20年来的专业与创新',
  introTitle: '公司简介',
  introImageUrl: '/company.jpg',
  introHtml:
    '<p>江西联合化工有限公司分别成立于2002年，总部设在国家级新型工业化产业示范基地——星火工业园。公司主要经营生产：丙烯酸树脂，PP树脂，触变型树脂，丙烯酸水分散体，聚酯树脂，氨基树脂，环氧磷酸酯，蜡分散体等。预计年产值可达8亿元人民币。</p>' +
    '<p>我司具有强大的研发团队，可以按照客户要求定制树脂，我司已跟跟国内外涂料厂建立合作。我司特别是在汽车内外饰件和原厂漆方面有大量的应用案例，这块积累了很多应用经验和成熟的案例。为客户解决难点和痛点，一直是联合人前进的方向。</p>' +
    '<p>我们新建高标准厂房，DCS控制的设备、完善的质量保证体系是我们生产高性能树脂的保障。我们依托高科技，立足于高起点，借鉴现代管理理念，采用一流的研发和生产设备，拥有一流的研发团队。该项目的未来前景非常广阔。</p>' +
    '<p>我们依托高科技、立足高起点，借鉴现代管理理念，采用一流生产和检测设备，致力于各种涂料的研发、生产和销售。逐步创建了一套既紧密联系中国国情，又充分反映企业实际的管理体系。</p>' +
    '<p>高科技、高品质、高信誉是我们永恒的追求；"生产一流产品、提供一流服务"是我们庄严的承诺。愿我们不懈地努力，与您携手共同发展，共创辉煌！</p>',
  missionTitle: '公司使命',
  missionDescription: '通过提供高质量的化工产品和专业的技术服务，为客户创造价值，推动行业发展。',
  visionTitle: '公司愿景',
  visionDescription: '成为全球领先的化工产品供应商，引领行业技术创新和可持续发展。',
  milestones: [
    { year: '2002', title: '公司成立', description: '江西联合化工有限公司正式成立，总部设在国家级新型工业化产业示范基地——星火工业园，专注树脂产品研发生产', badge: '创业启航', color: 'gold' },
    { year: '2005', title: '产品线完善', description: '形成完整的树脂产品体系：丙烯酸树脂、PP树脂、触变型树脂、丙烯酸水分散体、聚酯树脂、氨基树脂、环氧磷酸酯、蜡分散体等', badge: '产品矩阵', color: 'secondary' },
    { year: '2010', title: '技术突破', description: '建立强大研发团队，实现汽车内外饰件和原厂漆领域重大技术突破，积累大量成熟应用案例', badge: '技术创新', color: 'accent' },
    { year: '2015', title: '产业升级', description: '新建高标准厂房，引进DCS控制设备，建立完善的质量保证体系，实现年产值8亿元目标', badge: '产能升级', color: 'gold' },
    { year: '2020', title: '市场拓展', description: '与国内外知名涂料厂建立深度合作，定制化树脂服务能力显著提升，客户满意度持续提高', badge: '合作共赢', color: 'accent' },
  ],
  stats: [
    { number: '20+', label: '年行业经验' },
    { number: '8亿', label: '年产值(元)' },
    { number: '8+', label: '产品系列' },
  ],
  rdTitle: '研发与技术',
  rdCards: [
    { icon: 'flask', title: '技术研发', description: '拥有专业的研发团队，不断开发新产品，提升技术水平。' },
    { icon: 'shield', title: '质量认证', description: '通过多项国际质量认证，确保产品质量达到世界先进水平。' },
    { icon: 'team', title: '专家团队', description: '汇聚国内外化工领域顶尖专家，为产品研发提供强大支持。' },
  ],
}

export const FALLBACK_CONTACT_PAGE: ContactPageData = {
  formTitle: '发送消息',
  infoTitle: '联系方式',
  mapTitle: '地理位置',
  mapDescription:
    '江西联合化工有限公司位于国家级新型工业化产业示范基地——星火工业园，交通便利，配套设施完善',
}

// ---------- 工具函数 ----------

function mediaUrl(m: unknown, fallback: string): string {
  if (m && typeof m === 'object') {
    const url = (m as { url?: string }).url
    if (url) return url
  }
  return fallback
}

function pick(o: unknown, key: string, fallback: string): string {
  if (o && typeof o === 'object' && key in o) {
    const v = (o as Record<string, unknown>)[key]
    if (typeof v === 'string' && v.trim()) return v
  }
  return fallback
}

/**
 * 统一封装 findGlobal。slug 用 as any 绕过类型联合校验，
 * 使本文件可在全局未全部注册前通过 typecheck（未注册/未 seed 时抛错被调用方 catch 回退兜底）。
 */
async function findGlobal(slug: string, depth = 1): Promise<any> {
  const payload = await getPayloadClient()
  return (await payload.findGlobal({ slug: slug as any, depth })) as any
}

// ---------- 获取函数（任何缺失回退到兜底） ----------

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const g = await findGlobal('site-settings', 1)
    const contact = g.contact || {}
    return {
      siteName: pick(g, 'siteName', FALLBACK_SITE_SETTINGS.siteName),
      siteTagline: pick(g, 'siteTagline', FALLBACK_SITE_SETTINGS.siteTagline),
      logoUrl: mediaUrl(g.logo, FALLBACK_SITE_SETTINGS.logoUrl),
      footerDescription: pick(g, 'footerDescription', FALLBACK_SITE_SETTINGS.footerDescription),
      qualityMark: pick(g, 'qualityMark', FALLBACK_SITE_SETTINGS.qualityMark),
      qualityDesc: pick(g, 'qualityDesc', FALLBACK_SITE_SETTINGS.qualityDesc),
      icpNumber: pick(g, 'icpNumber', FALLBACK_SITE_SETTINGS.icpNumber),
      copyrightText: pick(g, 'copyrightText', FALLBACK_SITE_SETTINGS.copyrightText),
      contact: {
        address: pick(contact, 'address', FALLBACK_SITE_SETTINGS.contact.address),
        addressLine2: pick(contact, 'addressLine2', FALLBACK_SITE_SETTINGS.contact.addressLine2),
        zipCode: pick(contact, 'zipCode', FALLBACK_SITE_SETTINGS.contact.zipCode),
        phone: pick(contact, 'phone', FALLBACK_SITE_SETTINGS.contact.phone),
        fax: pick(contact, 'fax', FALLBACK_SITE_SETTINGS.contact.fax),
        email: pick(contact, 'email', FALLBACK_SITE_SETTINGS.contact.email),
        techPhone: pick(contact, 'techPhone', FALLBACK_SITE_SETTINGS.contact.techPhone),
      },
      socialLinks: Array.isArray(g.socialLinks)
        ? g.socialLinks
            .filter((l: any) => l?.label && l?.url)
            .map((l: any) => ({ label: l.label, url: l.url }))
        : [],
      legalLinks: Array.isArray(g.legalLinks)
        ? g.legalLinks
            .filter((l: any) => l?.label && l?.url)
            .map((l: any) => ({ label: l.label, url: l.url }))
        : FALLBACK_SITE_SETTINGS.legalLinks,
      seo: {
        metaTitle: pick(g.seo, 'metaTitle', ''),
        metaDescription: pick(g.seo, 'metaDescription', ''),
        keywords: pick(g.seo, 'keywords', ''),
        canonical: pick(g.seo, 'canonical', ''),
        noindex: !!g.seo?.noindex,
      },
    }
  } catch (e) {
    console.error('getSiteSettings failed:', e)
    return FALLBACK_SITE_SETTINGS
  }
}

export async function getNavigation(): Promise<NavItem[]> {
  try {
    const g = await findGlobal('navigation', 0)
    if (Array.isArray(g.items) && g.items.length > 0) {
      return g.items
        .filter((i: any) => i?.isActive && i?.label && i?.href)
        .map((i: any) => ({ label: i.label, href: i.href }))
    }
    return FALLBACK_NAV_ITEMS
  } catch (e) {
    console.error('getNavigation failed:', e)
    return FALLBACK_NAV_ITEMS
  }
}

export async function getPageHeaders(): Promise<PageHeadersData> {
  try {
    const g = await findGlobal('page-headers', 0)
    const h = (k: string) => ({
      enabled: g[k]?.enabled !== false,
      title: pick(g[k], 'title', ''),
      subtitle: pick(g[k], 'subtitle', ''),
    })
    return {
      productsPage: { ...FALLBACK_PAGE_HEADERS.productsPage, ...h('productsPage') },
      newsPage: { ...FALLBACK_PAGE_HEADERS.newsPage, ...h('newsPage') },
      careersPage: { ...FALLBACK_PAGE_HEADERS.careersPage, ...h('careersPage') },
      contactPage: { ...FALLBACK_PAGE_HEADERS.contactPage, ...h('contactPage') },
    }
  } catch (e) {
    console.error('getPageHeaders failed:', e)
    return FALLBACK_PAGE_HEADERS
  }
}

const homeSection = (g: any, key: string) => g[key] || {}

export async function getHomePage(): Promise<HomePageData> {
  try {
    const g = await findGlobal('home-page', 1)
    const F = FALLBACK_HOME_PAGE
    return {
      hero: {
        enabled: homeSection(g, 'hero').enabled !== false,
        title: pick(homeSection(g, 'hero'), 'title', F.hero.title),
        subtitleLine1: pick(homeSection(g, 'hero'), 'subtitleLine1', F.hero.subtitleLine1),
        subtitleLine2: pick(homeSection(g, 'hero'), 'subtitleLine2', F.hero.subtitleLine2),
        bgImageUrl: mediaUrl(homeSection(g, 'hero').bgImage, pick(homeSection(g, 'hero'), 'bgImageUrl', F.hero.bgImageUrl)),
        primaryButtonText: pick(homeSection(g, 'hero'), 'primaryButtonText', F.hero.primaryButtonText),
        primaryButtonHref: pick(homeSection(g, 'hero'), 'primaryButtonHref', F.hero.primaryButtonHref),
        secondaryButtonText: pick(homeSection(g, 'hero'), 'secondaryButtonText', F.hero.secondaryButtonText),
        secondaryButtonHref: pick(homeSection(g, 'hero'), 'secondaryButtonHref', F.hero.secondaryButtonHref),
        scrollText: pick(homeSection(g, 'hero'), 'scrollText', F.hero.scrollText),
      },
      showcase: {
        enabled: homeSection(g, 'showcase').enabled !== false,
        title: pick(homeSection(g, 'showcase'), 'title', F.showcase.title),
        subtitle: pick(homeSection(g, 'showcase'), 'subtitle', F.showcase.subtitle),
        ctaText: pick(homeSection(g, 'showcase'), 'ctaText', F.showcase.ctaText),
        ctaHref: pick(homeSection(g, 'showcase'), 'ctaHref', F.showcase.ctaHref),
        cards: Array.isArray(homeSection(g, 'showcase').cards) && homeSection(g, 'showcase').cards.length
          ? homeSection(g, 'showcase').cards.map((c: any) => ({
              title: pick(c, 'title', ''),
              description: pick(c, 'description', ''),
              imageUrl: mediaUrl(c.image, pick(c, 'imageUrl', '')),
              href: pick(c, 'href', '/products'),
            }))
          : F.showcase.cards,
      },
      features: {
        enabled: homeSection(g, 'features').enabled !== false,
        title: pick(homeSection(g, 'features'), 'title', F.features.title),
        subtitle: pick(homeSection(g, 'features'), 'subtitle', F.features.subtitle),
        features: Array.isArray(homeSection(g, 'features').features) && homeSection(g, 'features').features.length
          ? homeSection(g, 'features').features.map((c: any) => ({
              icon: pick(c, 'icon', 'check'),
              title: pick(c, 'title', ''),
              description: pick(c, 'description', ''),
            }))
          : F.features.features,
      },
      factory: {
        enabled: homeSection(g, 'factory').enabled !== false,
        title: pick(homeSection(g, 'factory'), 'title', F.factory.title),
        subtitle: pick(homeSection(g, 'factory'), 'subtitle', F.factory.subtitle),
        imageUrl: mediaUrl(homeSection(g, 'factory').image, pick(homeSection(g, 'factory'), 'imageUrl', F.factory.imageUrl)),
        overlayTitle: pick(homeSection(g, 'factory'), 'overlayTitle', F.factory.overlayTitle),
        overlayText: pick(homeSection(g, 'factory'), 'overlayText', F.factory.overlayText),
      },
      stats: {
        enabled: homeSection(g, 'stats').enabled !== false,
        title: pick(homeSection(g, 'stats'), 'title', F.stats.title),
        subtitle: pick(homeSection(g, 'stats'), 'subtitle', F.stats.subtitle),
        stats: Array.isArray(homeSection(g, 'stats').stats) && homeSection(g, 'stats').stats.length
          ? homeSection(g, 'stats').stats.map((c: any) => ({
              number: pick(c, 'number', ''),
              label: pick(c, 'label', ''),
            }))
          : F.stats.stats,
      },
      cta: {
        enabled: homeSection(g, 'cta').enabled !== false,
        title: pick(homeSection(g, 'cta'), 'title', F.cta.title),
        subtitle: pick(homeSection(g, 'cta'), 'subtitle', F.cta.subtitle),
        primaryButtonText: pick(homeSection(g, 'cta'), 'primaryButtonText', F.cta.primaryButtonText),
        primaryButtonHref: pick(homeSection(g, 'cta'), 'primaryButtonHref', F.cta.primaryButtonHref),
        secondaryButtonText: pick(homeSection(g, 'cta'), 'secondaryButtonText', F.cta.secondaryButtonText),
        secondaryButtonHref: pick(homeSection(g, 'cta'), 'secondaryButtonHref', F.cta.secondaryButtonHref),
      },
    }
  } catch (e) {
    console.error('getHomePage failed:', e)
    return FALLBACK_HOME_PAGE
  }
}

export async function getAboutPage(): Promise<AboutPageData> {
  try {
    const g = await findGlobal('about-page', 1)
    const F = FALLBACK_ABOUT_PAGE
    const introGroup = g.introGroup || {}
    return {
      heroTitle: pick(g, 'heroTitle', F.heroTitle),
      heroSubtitle: pick(g, 'heroSubtitle', F.heroSubtitle),
      introTitle: pick(introGroup, 'introTitle', F.introTitle),
      introHtml: lexicalToHtml(introGroup.introContent) || F.introHtml,
      introImageUrl: mediaUrl(introGroup.introImage, F.introImageUrl),
      missionTitle: pick(g, 'missionTitle', F.missionTitle),
      missionDescription: pick(g, 'missionDescription', F.missionDescription),
      visionTitle: pick(g, 'visionTitle', F.visionTitle),
      visionDescription: pick(g, 'visionDescription', F.visionDescription),
      milestones: Array.isArray(g.milestones) && g.milestones.length
        ? g.milestones.map((m: any) => ({
            year: pick(m, 'year', ''),
            title: pick(m, 'title', ''),
            description: pick(m, 'description', ''),
            badge: pick(m, 'badge', ''),
            color: ['gold', 'secondary', 'accent'].includes(m.color) ? m.color : 'gold',
          }))
        : F.milestones,
      stats: Array.isArray(g.stats) && g.stats.length
        ? g.stats.map((s: any) => ({ number: pick(s, 'number', ''), label: pick(s, 'label', '') }))
        : F.stats,
      rdTitle: pick(g, 'rdTitle', F.rdTitle),
      rdCards: Array.isArray(g.rdCards) && g.rdCards.length
        ? g.rdCards.map((c: any) => ({
            icon: pick(c, 'icon', 'check'),
            title: pick(c, 'title', ''),
            description: pick(c, 'description', ''),
          }))
        : F.rdCards,
    }
  } catch (e) {
    console.error('getAboutPage failed:', e)
    return FALLBACK_ABOUT_PAGE
  }
}

export async function getContactPage(): Promise<ContactPageData> {
  try {
    const g = await findGlobal('contact-page', 0)
    const F = FALLBACK_CONTACT_PAGE
    return {
      formTitle: pick(g, 'formTitle', F.formTitle),
      infoTitle: pick(g, 'infoTitle', F.infoTitle),
      mapTitle: pick(g, 'mapTitle', F.mapTitle),
      mapDescription: pick(g, 'mapDescription', F.mapDescription),
    }
  } catch (e) {
    console.error('getContactPage failed:', e)
    return FALLBACK_CONTACT_PAGE
  }
}

// ---------- SEO → Next Metadata ----------

export function seoToMetadata(
  seo: { metaTitle?: string; metaDescription?: string; keywords?: string; canonical?: string; noindex?: boolean },
  fallback: { title: string; description: string },
): Metadata {
  const title = seo.metaTitle || fallback.title
  const description = seo.metaDescription || fallback.description
  const keywords = seo.keywords
    ? seo.keywords.split(/[,，]/).map((k) => k.trim()).filter(Boolean)
    : undefined
  return {
    title,
    description,
    keywords,
    ...(seo.noindex ? { robots: { index: false, follow: false } } : {}),
    ...(seo.canonical ? { alternates: { canonical: seo.canonical } } : {}),
  }
}
