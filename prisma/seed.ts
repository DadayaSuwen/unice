import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function main() {
  console.log('开始清空数据库所有数据...')

  // 清空数据库所有表的数据（按照外键依赖顺序）
  try {
    // 首先清空有外键依赖的表
    await prisma.contactSubmission.deleteMany()
    console.log('✓ 清空联系表单表')

    await prisma.product.deleteMany()
    console.log('✓ 清空产品表')

    await prisma.news.deleteMany()
    console.log('✓ 清空新闻表')

    await prisma.career.deleteMany()
    console.log('✓ 清空招聘表')

    await prisma.heroBanner.deleteMany()
    console.log('✓ 清空首页横幅表')

    await prisma.user.deleteMany()
    console.log('✓ 清空用户表')

    // 清空新闻分类表（被新闻表依赖）
    await prisma.newsCategory.deleteMany()
    console.log('✓ 清空新闻分类表')

    // 最后清空产品分类表（被产品表依赖）
    await prisma.category.deleteMany()
    console.log('✓ 清空产品分类表')

    console.log('🗑️ 数据库清空完成！')
  } catch (error) {
    console.error('清空数据库时出错:', error)
  }

  console.log('\n开始重新创建数据...')

  // 创建产品分类
  const categories = await prisma.category.createMany({
    data: [
      {
        name: '聚合物材料',
        slug: 'polymer-materials',
        description: '各类聚合物材料产品'
      },
      {
        name: '基础化工原料',
        slug: 'basic-chemicals',
        description: '基础化工原材料'
      },
      {
        name: '精细化学品',
        slug: 'fine-chemicals',
        description: '高附加值精细化学品'
      },
      {
        name: '溶剂类',
        slug: 'solvents',
        description: '各类有机溶剂'
      },
      {
        name: '无机酸类',
        slug: 'inorganic-acids',
        description: '无机酸类化学品'
      }
    ],
    skipDuplicates: true
  })

  console.log(`Created ${categories.count} categories`)

  // 创建新闻分类
  const newsCategories = await prisma.newsCategory.createMany({
    data: [
      {
        name: '公司新闻',
        slug: 'company-news',
        description: '公司内部新闻和公告',
        color: '#d4af37',
        sort_order: 1,
        is_active: true
      },
      {
        name: '行业资讯',
        slug: 'industry-news',
        description: '化工行业最新动态和政策',
        color: '#3498db',
        sort_order: 2,
        is_active: true
      },
      {
        name: '产品发布',
        slug: 'product-release',
        description: '新产品发布和更新',
        color: '#2ecc71',
        sort_order: 3,
        is_active: true
      },
      {
        name: '企业活动',
        slug: 'corporate-events',
        description: '公司举办的各类活动',
        color: '#e74c3c',
        sort_order: 4,
        is_active: true
      },
      {
        name: '技术创新',
        slug: 'technology-innovation',
        description: '技术研发和创新成果',
        color: '#9b59b6',
        sort_order: 5,
        is_active: true
      },
      {
        name: '社会责任',
        slug: 'social-responsibility',
        description: '企业社会责任相关活动',
        color: '#f39c12',
        sort_order: 6,
        is_active: true
      }
    ],
    skipDuplicates: true
  })

  console.log(`Created ${newsCategories.count} news categories`)

  // 获取创建后的分类数据以获取正确的ID
  const createdCategories = await prisma.category.findMany()
  const categoryMap = {}
  createdCategories.forEach(cat => {
    categoryMap[cat.slug] = cat.id
  })

  // 获取新闻分类ID映射
  const createdNewsCategories = await prisma.newsCategory.findMany()
  const newsCategoryMap = {}
  createdNewsCategories.forEach(cat => {
    newsCategoryMap[cat.slug] = cat.id
  })

  console.log('产品分类ID映射:', categoryMap)
  console.log('新闻分类ID映射:', newsCategoryMap)

  // 创建产品
  const products = await prisma.product.createMany({
    data: [
      {
        name: '聚丙烯颗粒',
        cas_no: '9003-07-2',
        category_id: categoryMap['polymer-materials'],
        description: '高品质聚丙烯颗粒，适用于注塑、吹塑等多种加工工艺。',
        details: JSON.stringify({
          "外观": "白色颗粒状",
          "熔融指数": "2.5 g/10min (230℃/2.16kg)",
          "密度": "0.90 g/cm³",
          "熔点": "160-170°C",
          "热变形温度": "100-110°C",
          "水分含量": "<0.01%",
          "灰分": "<0.01%"
        }),
        image_url: '/images/products/polypropylene.jpg',
        features: JSON.stringify([
          "优异的机械强度",
          "良好的耐化学性",
          "加工性能稳定",
          "成本低廉",
          "可回收利用"
        ]),
        applications: JSON.stringify([
          {
            name: "汽车零部件",
            description: "用于汽车保险杠、仪表盘、车门内饰板等零部件的制造"
          },
          {
            name: "家用电器外壳",
            description: "电视机、洗衣机、空调等家电产品的外壳和结构件"
          },
          {
            name: "包装容器",
            description: "食品包装盒、化妆品容器、工业零部件包装等"
          },
          {
            name: "医疗器械",
            description: "一次性医疗用品、诊断设备外壳、医用容器等"
          },
          {
            name: "建筑材料",
            description: "管道系统、绝缘材料、装饰板等建筑应用"
          }
        ]),
        safety_info: JSON.stringify({
          "危险性": "低毒、不易燃",
          "储存条件": "干燥通风环境",
          "防护措施": "佩戴防尘口罩",
          "急救措施": "接触后用清水冲洗"
        }),
        is_active: true
      },
      {
        name: '苯乙烯',
        cas_no: '100-42-5',
        category_id: categoryMap['basic-chemicals'],
        description: '高纯度苯乙烯单体，广泛应用于聚合物合成领域。',
        details: JSON.stringify({
          "纯度": "≥99.5%",
          "外观": "无色透明液体",
          "沸点": "145°C",
          "密度": "0.906 g/cm³",
          "折射率": "1.5469"
        }),
        image_url: '/images/products/styrene.jpg',
        features: JSON.stringify([
          "高纯度",
          "化学性质稳定",
          "聚合反应活性强",
          "储存稳定性好"
        ]),
        applications: JSON.stringify([
          {
            name: "聚苯乙烯生产",
            description: "作为主要单体用于聚苯乙烯的聚合反应"
          },
          {
            name: "ABS树脂合成",
            description: "合成丙烯腈-丁二烯-苯乙烯共聚物的关键原料"
          },
          {
            name: "丁苯橡胶制备",
            description: "生产丁苯橡胶的重要单体材料"
          },
          {
            name: "不饱和聚酯树脂",
            description: "用于制造玻璃钢等复合材料"
          },
          {
            name: "合成纤维单体",
            description: "生产合成纤维和聚合物的原料"
          }
        ]),
        safety_info: JSON.stringify({
          "危险性": "易燃、有毒",
          "储存条件": "阴凉通风、密封保存",
          "防护措施": "佩戴防毒面具、防护手套",
          "急救措施": "溅入眼中立即用大量清水冲洗"
        }),
        is_active: true
      },
      {
        name: '环氧乙烷',
        cas_no: '75-81-4',
        category_id: categoryMap['fine-chemicals'],
        description: '重要的有机合成中间体，用于生产乙二醇和其他化学品。',
        details: JSON.stringify({
          "纯度": "≥99.0%",
          "外观": "无色气体",
          "沸点": "10.7°C",
          "密度": "0.854 g/cm³",
          "爆炸极限": "3.6-100%"
        }),
        image_url: '/images/products/ethylene-oxide.jpg',
        features: JSON.stringify([
          "高反应活性",
          "环氧化能力强",
          "纯度高达99%",
          "溶解性能好"
        ]),
        applications: JSON.stringify([
          {
            name: "乙二醇生产",
            description: "作为主要原料生产乙二醇，用于防冻液和聚酯纤维"
          },
          {
            name: "表面活性剂合成",
            description: "制造非离子表面活性剂，用于洗涤剂和乳化剂"
          },
          {
            name: "乙醇胺制备",
            description: "生产一乙醇胺、二乙醇胺等化工产品"
          },
          {
            name: "消毒剂生产",
            description: "用于制造医用消毒剂和卫生产品"
          },
          {
            name: "纺织助剂",
            description: "纺织品整理剂和染料中间体的生产"
          }
        ]),
        safety_info: JSON.stringify({
          "危险性": "易燃易爆、有毒致癌",
          "储存条件": "压力容器、阴凉通风",
          "防护措施": "全面防护装备、防爆设备",
          "急救措施": "立即脱离现场、紧急医疗救助"
        }),
        is_active: true
      },
      {
        name: '甲苯',
        cas_no: '108-88-3',
        category_id: categoryMap['solvents'],
        description: '常用的有机溶剂，广泛应用于涂料、粘合剂等领域。',
        details: JSON.stringify({
          "纯度": "≥99.5%",
          "外观": "无色透明液体",
          "沸点": "110.6°C",
          "密度": "0.867 g/cm³",
          "闪点": "4°C"
        }),
        image_url: '/images/products/toluene.jpg',
        features: JSON.stringify([
          "优异的溶解性能",
          "挥发速度快",
          "化学性质稳定",
          "性价比高"
        ]),
        applications: JSON.stringify([
          {
            name: "油漆涂料溶剂",
            description: "作为溶剂用于油漆、涂料和清漆的配方中"
          },
          {
            name: "胶粘剂稀释剂",
            description: "稀释各种胶粘剂，调节粘度便于施工"
          },
          {
            name: "油墨清洗剂",
            description: "印刷设备的清洗剂和油墨配方成分"
          },
          {
            name: "化学合成原料",
            description: "合成TNT、苯甲酸、甲酚等化学品"
          },
          {
            name: "医药中间体",
            description: "制药工业中的溶剂和反应介质"
          }
        ]),
        safety_info: JSON.stringify({
          "危险性": "易燃、低毒",
          "储存条件": "密封保存、远离火源",
          "防护措施": "防静电、通风良好",
          "急救措施": "皮肤接触用肥皂水清洗"
        }),
        is_active: true
      },
      {
        name: '硫酸',
        cas_no: '7664-93-9',
        category_id: categoryMap['inorganic-acids'],
        description: '浓度98%的浓硫酸，广泛用于化工生产和实验室研究。',
        details: JSON.stringify({
          "浓度": "98%",
          "外观": "无色至微黄色油状液体",
          "密度": "1.84 g/cm³",
          "沸点": "337°C",
          "凝固点": "10.37°C"
        }),
        image_url: '/images/products/sulfuric-acid.jpg',
        features: JSON.stringify([
          "强酸性",
          "脱水能力强",
          "氧化性强",
          "化学性质稳定",
          "价格低廉"
        ]),
        applications: JSON.stringify([
          {
            name: "化肥生产",
            description: "制造硫酸铵、过磷酸钙等化肥产品"
          },
          {
            name: "石油精炼",
            description: "原油精炼过程中的酸洗和催化剂再生"
          },
          {
            name: "金属表面处理",
            description: "钢材酸洗、电镀前的表面清洁处理"
          },
          {
            name: "电池制造",
            description: "铅酸蓄电池电解液的配制"
          },
          {
            name: "实验室试剂",
            description: "化学实验室常用的分析试剂和催化剂"
          }
        ]),
        safety_info: JSON.stringify({
          "危险性": "强腐蚀性、强氧化性",
          "储存条件": "耐酸容器、干燥通风",
          "防护措施": "防酸服、护目镜、耐酸手套",
          "急救措施": "立即用大量清水冲洗、就医"
        }),
        is_active: true
      }
    ],
    skipDuplicates: true
  })

  console.log(`Created ${products.count} products`)

  // 创建新闻 - 江西联合化学有限公司新闻（使用基本字段）
  const news = await prisma.news.createMany({
    data: [
      {
        title: '江西联合化学荣获2024年度化工行业创新奖',
        excerpt: '凭借在新材料研发领域的突出贡献，江西联合化学荣获中国化工协会颁发的年度创新奖，这是对公司20余年专注树脂研发的高度认可。',
        content: `江西联合化学有限公司在2024年度中国化工协会评选中荣获"化工行业创新奖"，这是对公司在新材料研发领域卓越贡献的高度认可。

本次获奖的创新项目主要涉及新型环保树脂的研发与应用。联合化学研发团队历时三年，成功开发出具有自主知识产权的新一代环保树脂产品，其性能指标达到国际领先水平。

该创新产品在以下方面实现了重大突破：
- 挥发性有机化合物（VOC）含量降低80%以上
- 产品纯度达到99.9%，超越行业标准
- 生产能耗降低30%，实现绿色制造
- 产品应用范围扩大到航空航天等高端领域

这一创新成果不仅推动了化工行业的技术进步，也为我国在高端化工材料领域赢得了国际声誉。产品已成功应用于多个重点工程项目，获得客户的一致好评。

江西联合化学将继续加大研发投入，依托星火工业园区的产业优势，在更多前沿领域实现技术突破，为化工行业的高质量发展贡献更大力量。`,
        type: 'news',
        category_id: newsCategoryMap['company-news'],
        publish_date: new Date('2024-11-10'),
        is_published: true
      },
      {
        title: '新一代汽车原厂漆树脂正式投产',
        excerpt: '我公司研发团队历时三年开发的新一代汽车原厂漆专用树脂正式投产，性能达到国际领先水平，已获得多家知名汽车厂商认证。',
        content: `江西联合化学有限公司研发团队历时三年开发的新一代汽车原厂漆专用树脂正式投产，标志着我国在汽车涂料领域实现了重大技术突破。

新一代汽车原厂漆树脂具有以下显著特点：
- 优异的耐候性和耐化学性
- 出色的附着力和柔韧性
- 低温固化性能优良
- 环保性能突出，符合欧盟REACH法规

该产品主要应用于汽车内外饰件的涂装，包括保险杠、车门、仪表盘等部件的原厂漆涂装，已通过多家国内外知名汽车制造商的严格认证。

随着汽车工业的快速发展和环保要求的不断提高，高性能环保树脂的市场需求持续增长。公司预计该产品年产值将达到5亿元。`,
        type: 'product',
        category_id: newsCategoryMap['product-release'],
        publish_date: new Date('2024-11-08'),
        is_published: true
      },
      {
        title: '联合化学与欧洲知名企业达成战略合作',
        excerpt: '江西联合化学与德国巴斯夫公司签署战略合作协议，双方将在技术研发、市场拓展等多个领域开展深度合作。',
        content: `江西联合化学有限公司与德国巴斯夫公司在上海签署战略合作协议，双方将在技术研发、市场拓展等多个领域开展深度合作，共同开拓全球市场。

根据协议，双方将在以下方面展开合作：
- 共建联合研发中心，开发新一代环保树脂产品
- 共享技术专利和研发成果
- 共同开拓欧洲和亚洲市场
- 开展人才交流和技术培训

此次战略合作标志着江西联合化学的国际化战略迈出重要一步，有助于提升公司的技术水平和国际竞争力。

双方表示将充分发挥各自优势，在推动行业技术进步的同时，为全球客户提供更优质的产品和服务。`,
        type: 'news',
        category_id: newsCategoryMap['company-news'],
        publish_date: new Date('2024-11-05'),
        is_published: true
      },
      {
        title: '化工行业绿色发展趋势分析报告',
        excerpt: '根据最新市场调研数据，绿色化工和智能制造将成为未来发展的主要方向，环保法规日趋严格推动行业转型升级。',
        content: `中国化工协会发布最新行业发展趋势报告，指出绿色化工和智能制造将成为未来发展的主要方向。

报告显示，化工行业呈现以下发展趋势：
- 环保产品需求快速增长
- 智能制造加速普及
- 产业链整合程度提高
- 国际化竞争日趋激烈

随着"双碳"目标的推进，环保法规日趋严格，传统化工企业面临转型升级压力。

新能源汽车、航空航天等下游产业的快速发展为化工行业带来新的发展机遇。`,
        type: 'industry',
        category_id: newsCategoryMap['industry-news'],
        publish_date: new Date('2024-11-01'),
        is_published: true
      },
      {
        title: '星火工业园环保技术改造项目圆满完成',
        excerpt: '投资3000万元的环保技术改造项目正式完工，年可减少污染物排放80%以上，实现绿色生产目标。',
        content: `江西联合化学星火工业园环保技术改造项目正式完工，标志着公司在绿色制造方面迈上新台阶。

该项目总投资3000万元，主要包括：
- 废气处理系统升级改造
- 废水循环利用设施建设
- 固废减量化处理设备
- 环境监测体系建设

项目实施后，预计年可减少污染物排放80%以上，废水回用率达到95%，固废综合利用率达到98%。

该项目的完工不仅改善了区域环境质量，也为行业绿色发展树立了标杆。`,
        type: 'event',
        category_id: newsCategoryMap['corporate-events'],
        publish_date: new Date('2024-10-25'),
        is_published: true
      },
      {
        title: '公司举办2024年度技术创新大会',
        excerpt: '来自全国各地的技术专家齐聚星火工业园，共同探讨化工行业技术创新和未来发展。',
        content: `江西联合化学2024年度技术创新大会在星火工业园成功举办，来自全国各地的技术专家和客户代表齐聚一堂。

本次大会议程丰富，主要包括：
- 最新技术成果展示
- 行业专家主题演讲
- 技术交流与合作洽谈
- 工厂实地参观考察

大会展示了公司近年来在环保树脂、智能制造等领域取得的20余项技术成果。

会议期间，公司与多家企业达成技术合作协议，签约金额超过2亿元。`,
        type: 'event',
        category_id: newsCategoryMap['corporate-events'],
        publish_date: new Date('2024-10-20'),
        is_published: true
      }
    ],
    skipDuplicates: true
  })

  console.log(`Created ${news.count} news articles`)

  // 创建招聘信息 - 江西联合化学有限公司职位
  const careers = await prisma.career.createMany({
    data: [
      {
        position: '树脂研发工程师',
        department: '研发部',
        location: '星火工业园',
        type: 'full_time',
        experience_requirement: '3-5年经验',
        description: '负责丙烯酸树脂、PP树脂、触变型树脂等产品的研发工作，特别是在汽车内外饰件和原厂漆应用领域的技术开发。',
        requirements: JSON.stringify([
          '化工、高分子材料、应用化学等相关专业本科及以上学历',
          '3年以上树脂研发工作经验，熟悉汽车涂料行业者优先',
          '掌握树脂合成工艺和配方设计，能独立开展研发工作',
          '熟悉各类检测仪器和实验设备的操作',
          '具备良好的沟通能力和团队协作精神',
          '英语四级以上，能阅读英文技术资料'
        ]),
        responsibilities: JSON.stringify([
          '负责丙烯酸树脂、聚酯树脂、氨基树脂等产品的配方开发',
          '针对汽车内外饰件和原厂漆应用进行树脂性能优化',
          '制定和实施新产品研发计划，完成项目开发任务',
          '编写产品技术文档、工艺文件和质量标准',
          '配合生产和销售部门解决技术问题，提供技术支持',
          '跟踪行业技术发展动态，提出创新性技术方案'
        ]),
        is_active: true
      },
      {
        position: 'DCS控制工程师',
        department: '生产部',
        location: '星火工业园',
        type: 'full_time',
        experience_requirement: '2-4年经验',
        description: '负责DCS自动化控制系统的运行维护，确保生产设备安全稳定运行，优化生产工艺参数。',
        requirements: JSON.stringify([
          '自动化、化工机械、过程控制等相关专业大专及以上学历',
          '2年以上DCS系统操作维护经验，熟悉化工生产工艺',
          '掌握DCS系统的硬件结构、软件配置和编程方法',
          '具备化工工艺基础知识和安全意识',
          '能适应倒班工作，具备良好的应急处理能力',
          '持有相关资格证书者优先'
        ]),
        responsibilities: JSON.stringify([
          '负责DCS系统的日常监控、操作和维护工作',
          '监控生产过程中的关键参数，及时调整工艺条件',
          '处理DCS系统故障和报警，确保生产安全稳定',
          '参与新设备的调试、验收和员工培训工作',
          '优化控制方案，提高产品质量和生产效率',
          '记录运行数据，编写技术报告和改进建议'
        ]),
        is_active: true
      },
      {
        position: '涂料销售工程师',
        department: '销售部',
        location: '全国（华东、华南、华北）',
        type: 'full_time',
        experience_requirement: '2-3年经验',
        description: '负责公司在涂料行业的树脂产品销售，重点开发汽车原厂漆、工业漆等领域的客户资源。',
        requirements: JSON.stringify([
          '市场营销、化工或相关专业大专以上学历',
          '2年以上化工产品销售经验，有涂料行业背景者优先',
          '熟悉汽车涂料或工业涂料市场，了解客户需求',
          '具备较强的市场开拓能力和客户沟通技巧',
          '能适应频繁出差，工作积极主动',
          '具备良好的团队合作精神和抗压能力'
        ]),
        responsibilities: JSON.stringify([
          '负责指定区域的涂料市场开发和客户维护工作',
          '推广公司丙烯酸树脂、聚酯树脂等产品，完成销售目标',
          '深入了解客户需求，提供定制化的产品解决方案',
          '收集市场信息，分析竞争对手动态，制定销售策略',
          '参与商务谈判，处理客户投诉和售后服务',
          '配合技术部门为客户提供技术支持和服务'
        ]),
        is_active: true
      },
      {
        position: '质量检验员',
        department: '质控部',
        location: '星火工业园',
        type: 'full_time',
        experience_requirement: '1-3年经验',
        description: '负责原材料、半成品和成品的质量检验，确保产品质量符合标准要求。',
        requirements: JSON.stringify([
          '化工、质量管理等相关专业中专或以上学历',
          '1年以上化工产品质量检验经验',
          '熟悉各类检测仪器的操作和维护',
          '了解ISO9001质量管理体系要求',
          '工作认真负责，具备良好的质量意识',
          '能适应实验室工作环境'
        ]),
        responsibilities: JSON.stringify([
          '负责原材料进厂检验，确保符合采购技术要求',
          '进行生产过程监控和半成品质量检验',
          '完成成品出厂检验，出具质量检验报告',
          '操作和维护检验设备，确保仪器正常运行',
          '参与质量问题的分析和处理，提出改进建议',
          '整理质量记录，维护质量管理体系文件'
        ]),
        is_active: true
      },
      {
        position: '生产操作工',
        department: '生产部',
        location: '星火工业园',
        type: 'full_time',
        experience_requirement: '1-2年经验',
        description: '负责树脂生产设备的操作，按照工艺要求进行生产作业，确保产品质量和生产安全。',
        requirements: JSON.stringify([
          '化工、机械或相关专业中专、技校学历',
          '1年以上化工生产操作经验者优先',
          '了解基本的化工工艺和安全知识',
          '能适应倒班工作，具备良好的身体素质',
          '工作责任心强，严格遵守操作规程',
          '具备团队协作精神和学习能力'
        ]),
        responsibilities: JSON.stringify([
          '严格按照工艺文件和操作规程进行生产作业',
          '监控生产设备运行状态，及时发现和处理异常情况',
          '准确记录生产数据和操作参数',
          '参与设备的日常维护保养工作',
          '遵守安全生产制度，确保生产安全和环保',
          '配合完成生产计划，保证产品质量和产量'
        ]),
        is_active: true
      },
      {
        position: '环保技术员',
        department: '环保安全部',
        location: '星火工业园',
        type: 'full_time',
        experience_requirement: '2-4年经验',
        description: '负责公司环保设施的运行管理，确保废水、废气、固废处理达标排放，推进清洁生产。',
        requirements: JSON.stringify([
          '环境工程、化工等相关专业大专及以上学历',
          '2年以上化工企业环保管理经验',
          '熟悉环保法律法规和相关标准要求',
          '掌握三废处理工艺和设备的操作维护',
          '具备环境监测和数据分析能力',
          '持有环保相关资格证书者优先'
        ]),
        responsibilities: JSON.stringify([
          '负责废水、废气处理设施的日常运行和维护',
          '定期监测污染物排放数据，确保达标排放',
          '制定和实施环境保护措施，推进清洁生产',
          '处理环保投诉和应急事件，配合环保检查',
          '管理危险废物，确保合规处置',
          '编写环保报告，持续改进环境管理体系'
        ]),
        is_active: true
      }
    ],
    skipDuplicates: true
  })

  console.log(`Created ${careers.count} career positions`)

  // 初始化RBAC权限系统
  console.log('\n开始初始化RBAC权限系统...')

  // 创建基础权限
  const permissions = [
    // 用户管理权限
    { name: 'user.read', display_name: '查看用户', module: 'user', action: 'read', resource: 'all' },
    { name: 'user.create', display_name: '创建用户', module: 'user', action: 'create', resource: 'all' },
    { name: 'user.update', display_name: '更新用户', module: 'user', action: 'update', resource: 'all' },
    { name: 'user.delete', display_name: '删除用户', module: 'user', action: 'delete', resource: 'all' },
    { name: 'user.read.own', display_name: '查看自己的信息', module: 'user', action: 'read', resource: 'own' },
    { name: 'user.update.own', display_name: '更新自己的信息', module: 'user', action: 'update', resource: 'own' },

    // 角色管理权限
    { name: 'role.read', display_name: '查看角色', module: 'role', action: 'read', resource: 'all' },
    { name: 'role.create', display_name: '创建角色', module: 'role', action: 'create', resource: 'all' },
    { name: 'role.update', display_name: '更新角色', module: 'role', action: 'update', resource: 'all' },
    { name: 'role.delete', display_name: '删除角色', module: 'role', action: 'delete', resource: 'all' },
    { name: 'role.assign', display_name: '分配角色', module: 'role', action: 'assign', resource: 'all' },

    // 产品管理权限
    { name: 'product.read', display_name: '查看产品', module: 'product', action: 'read', resource: 'all' },
    { name: 'product.create', display_name: '创建产品', module: 'product', action: 'create', resource: 'all' },
    { name: 'product.update', display_name: '更新产品', module: 'product', action: 'update', resource: 'all' },
    { name: 'product.delete', display_name: '删除产品', module: 'product', action: 'delete', resource: 'all' },

    // 新闻管理权限
    { name: 'news.read', display_name: '查看新闻', module: 'news', action: 'read', resource: 'all' },
    { name: 'news.create', display_name: '创建新闻', module: 'news', action: 'create', resource: 'all' },
    { name: 'news.update', display_name: '更新新闻', module: 'news', action: 'update', resource: 'all' },
    { name: 'news.delete', display_name: '删除新闻', module: 'news', action: 'delete', resource: 'all' },
    { name: 'news.publish', display_name: '发布新闻', module: 'news', action: 'publish', resource: 'all' },

    // 招聘管理权限
    { name: 'career.read', display_name: '查看招聘', module: 'career', action: 'read', resource: 'all' },
    { name: 'career.create', display_name: '创建招聘', module: 'career', action: 'create', resource: 'all' },
    { name: 'career.update', display_name: '更新招聘', module: 'career', action: 'update', resource: 'all' },
    { name: 'career.delete', display_name: '删除招聘', module: 'career', action: 'delete', resource: 'all' },

    // 系统管理权限
    { name: 'system.dashboard', display_name: '访问仪表板', module: 'system', action: 'dashboard', resource: 'all' },
    { name: 'system.audit', display_name: '查看审计日志', module: 'system', action: 'audit', resource: 'all' },
    { name: 'system.settings', display_name: '系统设置', module: 'system', action: 'settings', resource: 'all' },
  ]

  console.log('创建权限...')
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: permission,
      create: {
        ...permission,
        is_system: true,
      },
    })
  }

  // 创建基础角色
  const roles = [
    {
      name: 'super_admin',
      display_name: '超级管理员',
      description: '拥有系统所有权限的超级管理员',
      level: 100,
      is_system: true,
    },
    {
      name: 'admin',
      display_name: '管理员',
      description: '系统管理员，拥有大部分管理权限',
      level: 80,
      is_system: true,
    },
    {
      name: 'editor',
      display_name: '编辑员',
      description: '内容编辑员，可以管理产品和新闻',
      level: 50,
      is_system: true,
    },
    {
      name: 'user',
      display_name: '普通用户',
      description: '普通用户，只能查看和修改自己的信息',
      level: 10,
      is_system: true,
    },
  ]

  console.log('创建角色...')
  const createdRoles = []
  for (const role of roles) {
    const createdRole = await prisma.role.upsert({
      where: { name: role.name },
      update: role,
      create: role,
    })
    createdRoles.push(createdRole)
  }

  // 为角色分配权限
  console.log('为角色分配权限...')

  // 超级管理员拥有所有权限
  const allPermissions = await prisma.permission.findMany()
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        role_id_permission_id: {
          role_id: createdRoles.find((r: any) => r.name === 'super_admin')!.id,
          permission_id: permission.id,
        },
      },
      update: {},
      create: {
        role_id: createdRoles.find((r: any) => r.name === 'super_admin')!.id,
        permission_id: permission.id,
      },
    })
  }

  // 管理员权限（除了用户删除和角色管理之外的所有权限）
  const adminPermissions = allPermissions.filter(p =>
    !p.name.includes('user.delete') &&
    !p.name.includes('role.delete') &&
    !p.name.includes('system.settings')
  )
  for (const permission of adminPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        role_id_permission_id: {
          role_id: createdRoles.find((r: any) => r.name === 'admin')!.id,
          permission_id: permission.id,
        },
      },
      update: {},
      create: {
        role_id: createdRoles.find((r: any) => r.name === 'admin')!.id,
        permission_id: permission.id,
      },
    })
  }

  // 编辑员权限（产品和新闻管理）
  const editorPermissions = allPermissions.filter(p =>
    p.module === 'product' ||
    p.module === 'news' ||
    p.name === 'system.dashboard'
  )
  for (const permission of editorPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        role_id_permission_id: {
          role_id: createdRoles.find((r: any) => r.name === 'editor')!.id,
          permission_id: permission.id,
        },
      },
      update: {},
      create: {
        role_id: createdRoles.find((r: any) => r.name === 'editor')!.id,
        permission_id: permission.id,
      },
    })
  }

  // 普通用户权限（只能查看和修改自己的信息）
  const userPermissions = allPermissions.filter(p =>
    p.name === 'user.read.own' ||
    p.name === 'user.update.own'
  )
  for (const permission of userPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        role_id_permission_id: {
          role_id: createdRoles.find((r: any) => r.name === 'user')!.id,
          permission_id: permission.id,
        },
      },
      update: {},
      create: {
        role_id: createdRoles.find((r: any) => r.name === 'user')!.id,
        permission_id: permission.id,
      },
    })
  }

  console.log('RBAC权限系统初始化完成！')

  // 创建初始用户并分配角色
  console.log('\n创建初始用户...')
  const bcrypt = require('bcrypt')
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@unicechemical.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@unicechemical.com',
      password_hash: hashedPassword,
      role: 'administrator',
      first_name: '系统',
      last_name: '管理员',
      is_active: true,
    },
  })

  // 为超级管理员用户分配super_admin角色
  const superAdminRole = createdRoles.find((r: any) => r.name === 'super_admin')!
  await prisma.userRole.upsert({
    where: {
      user_id_role_id: {
        user_id: adminUser.id,
        role_id: superAdminRole.id,
      },
    },
    update: {},
    create: {
      user_id: adminUser.id,
      role_id: superAdminRole.id,
    },
  })

  console.log(`Created user: ${adminUser.username} with super_admin role`)

  console.log('\n🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })