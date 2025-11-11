const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
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

  // 创建产品
  const products = await prisma.product.createMany({
    data: [
      {
        name: '聚丙烯颗粒',
        cas_no: '9003-07-2',
        category_id: 1,
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
        is_active: true
      },
      {
        name: '苯乙烯',
        cas_no: '100-42-5',
        category_id: 2,
        description: '高纯度苯乙烯单体，广泛应用于聚合物合成领域。',
        details: JSON.stringify({
          "纯度": "≥99.5%",
          "外观": "无色透明液体",
          "沸点": "145°C",
          "密度": "0.906 g/cm³",
          "折射率": "1.5469"
        }),
        is_active: true
      },
      {
        name: '环氧乙烷',
        cas_no: '75-81-4',
        category_id: 3,
        description: '重要的有机合成中间体，用于生产乙二醇和其他化学品。',
        details: JSON.stringify({
          "纯度": "≥99.0%",
          "外观": "无色气体",
          "沸点": "10.7°C",
          "密度": "0.854 g/cm³",
          "爆炸极限": "3.6-100%"
        }),
        is_active: true
      },
      {
        name: '甲苯',
        cas_no: '108-88-3',
        category_id: 4,
        description: '常用的有机溶剂，广泛应用于涂料、粘合剂等领域。',
        details: JSON.stringify({
          "纯度": "≥99.5%",
          "外观": "无色透明液体",
          "沸点": "110.6°C",
          "密度": "0.867 g/cm³",
          "闪点": "4°C"
        }),
        is_active: true
      },
      {
        name: '硫酸',
        cas_no: '7664-93-9',
        category_id: 5,
        description: '浓度98%的浓硫酸，广泛用于化工生产和实验室研究。',
        details: JSON.stringify({
          "浓度": "98%",
          "外观": "无色至微黄色油状液体",
          "密度": "1.84 g/cm³",
          "沸点": "337°C",
          "凝固点": "10.37°C"
        }),
        is_active: true
      }
    ],
    skipDuplicates: true
  })

  console.log(`Created ${products.count} products`)

  // 创建新闻
  const news = await prisma.news.createMany({
    data: [
      {
        title: '联合化工荣获2023年度优秀企业奖',
        excerpt: '在2023年度行业评选中，联合化工凭借卓越的产品质量和创新能力，成功荣获优秀企业奖。',
        content: '在2023年度行业评选中，联合化工凭借卓越的产品质量和创新能力，成功荣获优秀企业奖。这一荣誉不仅是对我们过去一年工作的认可，更是对未来发展的激励。我们将继续秉承质量第一、客户至上的理念，为客户提供更优质的产品和服务。',
        type: '公司公告',
        is_published: true
      },
      {
        title: '新产品系列发布，引领行业创新',
        excerpt: '公司最新研发的高性能聚合物系列产品正式发布，将在多个应用领域展现卓越性能。',
        content: '公司最新研发的高性能聚合物系列产品正式发布，将在多个应用领域展现卓越性能。该系列产品具有优异的机械强度、耐化学性和加工性能，可广泛应用于汽车、电子、家电等行业。我们相信，这一创新成果将进一步巩固我们在行业内的领先地位。',
        type: '行业动态',
        is_published: true
      },
      {
        title: '环保技术升级，践行可持续发展',
        excerpt: '公司投资数百万实施环保技术改造，进一步降低生产过程中的环境影响。',
        content: '公司投资数百万实施环保技术改造，进一步降低生产过程中的环境影响。此次升级改造包括废气处理系统优化、废水循环利用设施建设和固体废物减量化措施等。我们致力于在追求企业发展的同时，积极履行社会责任，推动可持续发展。',
        type: '公司公告',
        is_published: true
      },
      {
        title: '参加第十九届国际化工展览会',
        excerpt: '联合化工将亮相第十九届国际化工展览会，展示最新技术和产品。',
        content: '联合化工将亮相第十九届国际化工展览会，展示最新技术和产品。本次参展将重点展示我们在高性能聚合物、精细化学品等领域的最新研究成果。我们诚邀各界朋友莅临参观，共同探讨合作机会。',
        type: '展会信息',
        is_published: true
      }
    ],
    skipDuplicates: true
  })

  console.log(`Created ${news.count} news articles`)

  // 创建招聘信息
  const careers = await prisma.career.createMany({
    data: [
      {
        position: '高级研发工程师',
        department: '研发部',
        location: '北京总部',
        type: 'full_time',
        experience_requirement: '3-5年经验',
        description: '负责化工产品的新品研发和工艺改进工作，参与技术方案制定。',
        requirements: JSON.stringify([
          '化工、材料等相关专业本科及以上学历',
          '3年以上化工研发工作经验',
          '熟悉化工工艺流程和设备',
          '具备良好的沟通能力和团队协作精神',
          '英语读写能力良好'
        ]),
        responsibilities: JSON.stringify([
          '新产品开发和实验设计',
          '生产工艺优化和改进',
          '技术文档编写和整理',
          '协助解决生产中的技术问题',
          '参与技术交流和培训'
        ]),
        is_active: true
      },
      {
        position: '销售经理',
        department: '销售部',
        location: '全国',
        type: 'full_time',
        experience_requirement: '2-3年经验',
        description: '负责化工产品的市场推广和客户关系维护，完成销售目标。',
        requirements: JSON.stringify([
          '市场营销或化工相关专业大专以上学历',
          '2年以上化工产品销售经验',
          '具备较强的沟通表达能力和谈判技巧',
          '熟悉化工行业市场状况',
          '能适应出差'
        ]),
        responsibilities: JSON.stringify([
          '开发和维护客户资源',
          '制定销售计划和策略',
          '完成个人及团队销售目标',
          '参与商务谈判和合同签订',
          '收集市场信息和竞争对手情报'
        ]),
        is_active: true
      }
    ],
    skipDuplicates: true
  })

  console.log(`Created ${careers.count} career positions`)

  // 创建初始用户
  const user = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@unicechemical.com',
      password_hash: '$2b$10$example_hash', // 这只是一个示例，实际应该使用bcrypt加密
      role: 'administrator',
      first_name: '管理员',
      last_name: '系统',
      is_active: true
    }
  })

  console.log(`Created user: ${user.username}`)

  console.log('Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })