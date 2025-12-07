import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log("开始清空数据库所有数据...");

  // 清空数据库所有表的数据（按照外键依赖顺序）
  try {
    // 首先清空有外键依赖的表
    await prisma.contactSubmission.deleteMany();
    console.log("✓ 清空联系表单表");

    await prisma.product.deleteMany();
    console.log("✓ 清空产品表");

    await prisma.news.deleteMany();
    console.log("✓ 清空新闻表");

    await prisma.career.deleteMany();
    console.log("✓ 清空招聘表");

    await prisma.heroBanner.deleteMany();
    console.log("✓ 清空首页横幅表");

    await prisma.user.deleteMany();
    console.log("✓ 清空用户表");

    // 清空新闻分类表（被新闻表依赖）
    await prisma.newsCategory.deleteMany();
    console.log("✓ 清空新闻分类表");

    // 最后清空产品分类表（被产品表依赖）
    await prisma.category.deleteMany();
    console.log("✓ 清空产品分类表");

    console.log("🗑️ 数据库清空完成！");
  } catch (error) {
    console.error("清空数据库时出错:", error);
  }

  console.log("\n开始重新创建数据...");

  // 创建产品分类 (已调整为适配新产品列表的分类)
  const categories = await prisma.category.createMany({
    data: [
      {
        name: "热塑性树脂",
        slug: "thermoplastic-resins",
        description: "包括丙烯酸、PP树脂等热塑性材料，适用于物理干燥型涂料",
      },
      {
        name: "热固性树脂",
        slug: "thermosetting-resins",
        description: "包括聚酯、氨基树脂等，需交联固化，性能优异",
      },
      {
        name: "水性体系",
        slug: "waterborne-systems",
        description: "环保型水性乳液和分散体，低VOC排放",
      },
      {
        name: "功能性树脂",
        slug: "functional-resins",
        description: "具有触变、附着力促进等特殊功能的树脂",
      },
      {
        name: "助剂与添加剂",
        slug: "additives",
        description: "蜡分散体、特殊单体及改性剂",
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${categories.count} categories`);

  // 创建新闻分类
  const newsCategories = await prisma.newsCategory.createMany({
    data: [
      {
        name: "公司新闻",
        slug: "company-news",
        description: "公司内部新闻和公告",
        color: "#d4af37",
        sort_order: 1,
        is_active: true,
      },
      {
        name: "行业资讯",
        slug: "industry-news",
        description: "化工行业最新动态和政策",
        color: "#3498db",
        sort_order: 2,
        is_active: true,
      },
      {
        name: "产品发布",
        slug: "product-release",
        description: "新产品发布和更新",
        color: "#2ecc71",
        sort_order: 3,
        is_active: true,
      },
      {
        name: "企业活动",
        slug: "corporate-events",
        description: "公司举办的各类活动",
        color: "#e74c3c",
        sort_order: 4,
        is_active: true,
      },
      {
        name: "技术创新",
        slug: "technology-innovation",
        description: "技术研发和创新成果",
        color: "#9b59b6",
        sort_order: 5,
        is_active: true,
      },
      {
        name: "社会责任",
        slug: "social-responsibility",
        description: "企业社会责任相关活动",
        color: "#f39c12",
        sort_order: 6,
        is_active: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${newsCategories.count} news categories`);

  // 获取创建后的分类数据以获取正确的ID
  const createdCategories = await prisma.category.findMany();
  const categoryMap = {};
  createdCategories.forEach((cat) => {
    categoryMap[cat.slug] = cat.id;
  });

  // 获取新闻分类ID映射
  const createdNewsCategories = await prisma.newsCategory.findMany();
  const newsCategoryMap = {};
  createdNewsCategories.forEach((cat) => {
    newsCategoryMap[cat.slug] = cat.id;
  });

  console.log("产品分类ID映射:", categoryMap);

  // 创建产品 - 按照要求替换为8种特定产品
  const products = await prisma.product.createMany({
    data: [
      {
        name: "丙烯酸树脂 (TPA-200)",
        cas_no: "25035-69-2",
        category_id: categoryMap["thermoplastic-resins"],
        description:
          "高性能热塑性丙烯酸树脂，专为汽车修补漆和高端工业涂料设计。",
        details: JSON.stringify({
          外观: "无色透明颗粒或液体",
          固含量: "50% ± 1%",
          粘度: "2000-4000 mPa.s",
          酸值: "4-8 mgKOH/g",
          玻璃化温度: "60°C",
          溶剂体系: "甲苯/二甲苯",
        }),
        image_url: "/images/products/acrylic-resin.jpg",
        features: JSON.stringify([
          "优异的金属颜料定向排列性",
          "极佳的耐候性和保光性",
          "干燥速度快，硬度高",
          "与CAB和NC不仅相容性好",
          "优异的耐醇性",
        ]),
        applications: JSON.stringify([
          {
            name: "汽车修补漆",
            description: "用于制造高品质汽车修补底色漆和清漆",
          },
          {
            name: "塑胶涂料",
            description: "ABS、PS等塑料表面的装饰性涂装",
          },
          {
            name: "集装箱涂料",
            description: "耐候性要求高的户外金属保护涂层",
          },
          {
            name: "一般工业漆",
            description: "机械设备和五金件的面漆",
          },
        ]),
        safety_info: JSON.stringify({
          危险性: "易燃液体",
          储存条件: "阴凉通风处，远离火源，库温不宜超过30℃",
          防护措施: "操作时需佩戴防毒面具和耐溶剂手套",
          急救措施: "吸入蒸气需迅速脱离现场至空气新鲜处",
        }),
        is_active: true,
      },
      {
        name: "PP树脂 (CPP-300)",
        cas_no: "68442-33-1",
        category_id: categoryMap["thermoplastic-resins"],
        description: "改性氯化聚丙烯树脂，对聚丙烯(PP)底材具有极佳的附着力。",
        details: JSON.stringify({
          外观: "淡黄色透明液体",
          固含量: "20% ± 1%",
          粘度: "200-500 mPa.s",
          氯含量: "28-32%",
          密度: "0.92 g/cm³",
        }),
        image_url: "/images/products/pp-resin.jpg",
        features: JSON.stringify([
          "对未处理的PP/EPDM底材附着力极强",
          "层间附着力优异",
          "低温成膜性好",
          "与多数面漆树脂配套性好",
        ]),
        applications: JSON.stringify([
          {
            name: "PP底材处理剂",
            description: "汽车保险杠、仪表盘等PP塑料件的打底处理",
          },
          {
            name: "复合油墨",
            description: "BOPP薄膜印刷油墨的连接料",
          },
          {
            name: "汽车内饰胶粘剂",
            description: "PP结构件的粘接",
          },
        ]),
        safety_info: JSON.stringify({
          危险性: "易燃，对水体环境有危害",
          储存条件: "密封保存，避免阳光直射",
          防护措施: "防止静电积聚",
          急救措施: "皮肤接触后用肥皂水彻底清洗",
        }),
        is_active: true,
      },
      {
        name: "触变型树脂 (SCA-50)",
        cas_no: "Trade Secret",
        category_id: categoryMap["functional-resins"],
        description:
          "特殊改性丙烯酸树脂，具有独特的触变流变特性，防止涂料流挂。",
        details: JSON.stringify({
          外观: "乳白色半透明液体",
          固含量: "40% ± 1%",
          触变指数: "TI ≥ 4.0",
          粘度: "500-1000 mPa.s",
          闪点: "25°C",
        }),
        image_url: "/images/products/thixotropic.jpg",
        features: JSON.stringify([
          "优异的防流挂性能",
          "极佳的铝粉定向排列能力",
          "防止金属颜料沉降",
          "改善立面涂装效果",
        ]),
        applications: JSON.stringify([
          {
            name: "汽车金属闪光漆",
            description: "确保铝粉在湿膜中定向排列，提高随角异色效果",
          },
          {
            name: "重防腐涂料",
            description: "厚膜型涂料的防流挂助剂",
          },
          {
            name: "效果颜料分散",
            description: "珠光粉、铝粉的高效分散介质",
          },
        ]),
        safety_info: JSON.stringify({
          危险性: "易燃",
          储存条件: "常温密闭储存",
          防护措施: "使用防爆设备",
          急救措施: "如不慎入眼，立即用大量清水冲洗",
        }),
        is_active: true,
      },
      {
        name: "丙烯酸水分散体 (W-ACR)",
        cas_no: "N/A",
        category_id: categoryMap["waterborne-systems"],
        description: "高性能羟基丙烯酸二级分散体，用于双组份水性聚氨酯涂料。",
        details: JSON.stringify({
          外观: "乳白色液体",
          固含量: "42% ± 1%",
          pH值: "7.0-8.5",
          羟值: "3.5% (基于固体树脂)",
          粘度: "100-500 mPa.s",
          最低成膜温度: "35°C",
        }),
        image_url: "/images/products/water-dispersion.jpg",
        features: JSON.stringify([
          "高光泽，高丰满度",
          "优异的耐水煮性能",
          "与水性固化剂相容性好",
          "低VOC，环保无味",
          "活化期长",
        ]),
        applications: JSON.stringify([
          {
            name: "水性木器漆",
            description: "高档家具、地板的面漆涂装",
          },
          {
            name: "水性工业漆",
            description: "农机、工程机械的防护装饰",
          },
          {
            name: "轨道交通内饰",
            description: "对环保要求严格的内饰件涂装",
          },
        ]),
        safety_info: JSON.stringify({
          危险性: "非危险品",
          储存条件: "5℃-35℃，防止冻结和暴晒",
          防护措施: "常规工业防护",
          急救措施: "用清水冲洗",
        }),
        is_active: true,
      },
      {
        name: "聚酯树脂 (PE-600)",
        cas_no: "67846-43-9",
        category_id: categoryMap["thermosetting-resins"],
        description: "饱和聚酯树脂，专为卷材涂料和印铁涂料设计。",
        details: JSON.stringify({
          外观: "浅黄色透明粘稠液体",
          固含量: "60% ± 1%",
          酸值: "3-6 mgKOH/g",
          羟值: "20-30 mgKOH/g",
          粘度: "3000-5000 mPa.s",
        }),
        image_url: "/images/products/polyester.jpg",
        features: JSON.stringify([
          "优异的柔韧性和加工成型性",
          "良好的耐候性",
          "附着力强，耐沸水煮",
          "颜料润湿性好",
        ]),
        applications: JSON.stringify([
          {
            name: "卷材涂料 (Coil Coating)",
            description: "用于建筑外墙板、家电板的面漆",
          },
          {
            name: "印铁涂料",
            description: "食品罐、饮料罐的外壁涂装",
          },
          {
            name: "烤漆体系",
            description: "与氨基树脂配合用于工业烤漆",
          },
        ]),
        safety_info: JSON.stringify({
          危险性: "易燃",
          储存条件: "密封保存，防止受潮",
          防护措施: "佩戴防护手套",
          急救措施: "常规有机溶剂处理",
        }),
        is_active: true,
      },
      {
        name: "氨基树脂 (HMMM-582)",
        cas_no: "3089-11-0",
        category_id: categoryMap["thermosetting-resins"],
        description: "高甲醚化三聚氰胺甲醛树脂，通用的高效交联剂。",
        details: JSON.stringify({
          外观: "无色透明粘稠液体",
          固含量: "≥98%",
          游离甲醛: "<0.5%",
          粘度: "2000-4000 mPa.s",
          密度: "1.20 g/cm³",
        }),
        image_url: "/images/products/amino-resin.jpg",
        features: JSON.stringify([
          "高固含，低VOC",
          "交联反应活性高",
          "漆膜硬度高，光泽度好",
          "储存稳定性优异",
          "自缩聚倾向低",
        ]),
        applications: JSON.stringify([
          {
            name: "汽车原厂漆",
            description: "作为主交联剂用于中涂和面漆",
          },
          {
            name: "卷材涂料",
            description: "提高涂层的硬度和耐溶剂性",
          },
          {
            name: "一般烤漆",
            description: "用于自行车、家电等五金烤漆",
          },
        ]),
        safety_info: JSON.stringify({
          危险性: "低毒",
          储存条件: "阴凉干燥处",
          防护措施: "避免吸入蒸汽",
          急救措施: "清洗接触部位",
        }),
        is_active: true,
      },
      {
        name: "环氧磷酸酯 (EP-Phos)",
        cas_no: "Trade Secret",
        category_id: categoryMap["functional-resins"],
        description: "特殊改性的环氧磷酸酯功能性树脂，主要作为附着力促进剂。",
        details: JSON.stringify({
          外观: "黄色透明液体",
          固含量: "50% ± 2%",
          酸值: "30-50 mgKOH/g",
          环氧值: "0",
          溶剂: "丁醇/二甲苯",
        }),
        image_url: "/images/products/epoxy-phosphate.jpg",
        features: JSON.stringify([
          "对有色金属（铝、镀锌板）附着力极佳",
          "优异的耐盐雾和耐腐蚀性能",
          "改善涂层的层间附着力",
          "可提高烘烤体系的耐水性",
        ]),
        applications: JSON.stringify([
          {
            name: "底漆配方",
            description: "用于环氧底漆、卷材底漆中增强防腐",
          },
          {
            name: "轻金属涂料",
            description: "铝合金、镁合金表面的涂装",
          },
          {
            name: "含锌涂料",
            description: "稳定锌粉，防止涨气",
          },
        ]),
        safety_info: JSON.stringify({
          危险性: "易燃，酸性",
          储存条件: "塑料桶或衬塑桶包装，密封",
          防护措施: "防腐蚀手套",
          急救措施: "大量水冲洗，就医",
        }),
        is_active: true,
      },
      {
        name: "蜡分散体 (Wax-D)",
        cas_no: "9002-88-4",
        category_id: categoryMap["additives"],
        description: "聚乙烯蜡分散体，用于改善涂层表面性能。",
        details: JSON.stringify({
          外观: "乳白色浆状",
          固含量: "15% ± 1%",
          蜡粉粒径: "6-8 μm",
          熔点: "110°C",
          溶剂体系: "二甲苯/酯类",
        }),
        image_url: "/images/products/wax-dispersion.jpg",
        features: JSON.stringify([
          "提高漆膜的抗划伤性",
          "提供优异的手感和滑爽性",
          "优异的消光均匀性",
          "防止沉降和结块",
          "不影响重涂性",
        ]),
        applications: JSON.stringify([
          {
            name: "木器面漆",
            description: "提供丝滑手感和抗刮保护",
          },
          {
            name: "工业烤漆",
            description: "调节光泽，增加表面硬度",
          },
          {
            name: "皮革涂饰剂",
            description: "改善皮革表面的滑爽感",
          },
        ]),
        safety_info: JSON.stringify({
          危险性: "易燃",
          储存条件: "远离火源，防止溶剂挥发",
          防护措施: "常规防护",
          急救措施: "皮肤清洗",
        }),
        is_active: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${products.count} products`);

  // 创建新闻 - 江西联合化工有限公司新闻（使用基本字段）
  const news = await prisma.news.createMany({
    data: [
      {
        title: "江西联合化工荣获2024年度化工行业创新奖",
        excerpt:
          "凭借在新材料研发领域的突出贡献，江西联合化工荣获中国化工协会颁发的年度创新奖，这是对公司20余年专注树脂研发的高度认可。",
        content: `江西联合化工有限公司在2024年度中国化工协会评选中荣获"化工行业创新奖"，这是对公司在新材料研发领域卓越贡献的高度认可。

本次获奖的创新项目主要涉及新型环保树脂的研发与应用。联合化工研发团队历时三年，成功开发出具有自主知识产权的新一代环保树脂产品，其性能指标达到国际领先水平。

该创新产品在以下方面实现了重大突破：
- 挥发性有机化合物（VOC）含量降低80%以上
- 产品纯度达到99.9%，超越行业标准
- 生产能耗降低30%，实现绿色制造
- 产品应用范围扩大到航空航天等高端领域

这一创新成果不仅推动了化工行业的技术进步，也为我国在高端化工材料领域赢得了国际声誉。产品已成功应用于多个重点工程项目，获得客户的一致好评。

江西联合化工将继续加大研发投入，依托星火工业园区的产业优势，在更多前沿领域实现技术突破，为化工行业的高质量发展贡献更大力量。`,
        type: "news",
        category_id: newsCategoryMap["company-news"],
        publish_date: new Date("2024-11-10"),
        is_published: true,
      },
      {
        title: "新一代汽车原厂漆树脂正式投产",
        excerpt:
          "我公司研发团队历时三年开发的新一代汽车原厂漆专用树脂正式投产，性能达到国际领先水平，已获得多家知名汽车厂商认证。",
        content: `江西联合化工有限公司研发团队历时三年开发的新一代汽车原厂漆专用树脂正式投产，标志着我国在汽车涂料领域实现了重大技术突破。

新一代汽车原厂漆树脂具有以下显著特点：
- 优异的耐候性和耐化学性
- 出色的附着力和柔韧性
- 低温固化性能优良
- 环保性能突出，符合欧盟REACH法规

该产品主要应用于汽车内外饰件的涂装，包括保险杠、车门、仪表盘等部件的原厂漆涂装，已通过多家国内外知名汽车制造商的严格认证。

随着汽车工业的快速发展和环保要求的不断提高，高性能环保树脂的市场需求持续增长。公司预计该产品年产值将达到5亿元。`,
        type: "product",
        category_id: newsCategoryMap["product-release"],
        publish_date: new Date("2024-11-08"),
        is_published: true,
      },
      {
        title: "联合化工与欧洲知名企业达成战略合作",
        excerpt:
          "江西联合化工与德国巴斯夫公司签署战略合作协议，双方将在技术研发、市场拓展等多个领域开展深度合作。",
        content: `江西联合化工有限公司与德国巴斯夫公司在上海签署战略合作协议，双方将在技术研发、市场拓展等多个领域开展深度合作，共同开拓全球市场。

根据协议，双方将在以下方面展开合作：
- 共建联合研发中心，开发新一代环保树脂产品
- 共享技术专利和研发成果
- 共同开拓欧洲和亚洲市场
- 开展人才交流和技术培训

此次战略合作标志着江西联合化工的国际化战略迈出重要一步，有助于提升公司的技术水平和国际竞争力。

双方表示将充分发挥各自优势，在推动行业技术进步的同时，为全球客户提供更优质的产品和服务。`,
        type: "news",
        category_id: newsCategoryMap["company-news"],
        publish_date: new Date("2024-11-05"),
        is_published: true,
      },
      {
        title: "化工行业绿色发展趋势分析报告",
        excerpt:
          "根据最新市场调研数据，绿色化工和智能制造将成为未来发展的主要方向，环保法规日趋严格推动行业转型升级。",
        content: `中国化工协会发布最新行业发展趋势报告，指出绿色化工和智能制造将成为未来发展的主要方向。

报告显示，化工行业呈现以下发展趋势：
- 环保产品需求快速增长
- 智能制造加速普及
- 产业链整合程度提高
- 国际化竞争日趋激烈

随着"双碳"目标的推进，环保法规日趋严格，传统化工企业面临转型升级压力。

新能源汽车、航空航天等下游产业的快速发展为化工行业带来新的发展机遇。`,
        type: "industry",
        category_id: newsCategoryMap["industry-news"],
        publish_date: new Date("2024-11-01"),
        is_published: true,
      },
      {
        title: "星火工业园环保技术改造项目圆满完成",
        excerpt:
          "投资3000万元的环保技术改造项目正式完工，年可减少污染物排放80%以上，实现绿色生产目标。",
        content: `江西联合化工星火工业园环保技术改造项目正式完工，标志着公司在绿色制造方面迈上新台阶。

该项目总投资3000万元，主要包括：
- 废气处理系统升级改造
- 废水循环利用设施建设
- 固废减量化处理设备
- 环境监测体系建设

项目实施后，预计年可减少污染物排放80%以上，废水回用率达到95%，固废综合利用率达到98%。

该项目的完工不仅改善了区域环境质量，也为行业绿色发展树立了标杆。`,
        type: "event",
        category_id: newsCategoryMap["corporate-events"],
        publish_date: new Date("2024-10-25"),
        is_published: true,
      },
      {
        title: "公司举办2024年度技术创新大会",
        excerpt:
          "来自全国各地的技术专家齐聚星火工业园，共同探讨化工行业技术创新和未来发展。",
        content: `江西联合化工2024年度技术创新大会在星火工业园成功举办，来自全国各地的技术专家和客户代表齐聚一堂。

本次大会议程丰富，主要包括：
- 最新技术成果展示
- 行业专家主题演讲
- 技术交流与合作洽谈
- 工厂实地参观考察

大会展示了公司近年来在环保树脂、智能制造等领域取得的20余项技术成果。

会议期间，公司与多家企业达成技术合作协议，签约金额超过2亿元。`,
        type: "event",
        category_id: newsCategoryMap["corporate-events"],
        publish_date: new Date("2024-10-20"),
        is_published: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${news.count} news articles`);

  // 创建招聘信息 - 江西联合化工有限公司职位
  const careers = await prisma.career.createMany({
    data: [
      {
        position: "树脂研发工程师",
        department: "研发部",
        location: "星火工业园",
        type: "full_time",
        experience_requirement: "3-5年经验",
        description:
          "负责丙烯酸树脂、PP树脂、触变型树脂等产品的研发工作，特别是在汽车内外饰件和原厂漆应用领域的技术开发。",
        requirements: JSON.stringify([
          "化工、高分子材料、应用化学等相关专业本科及以上学历",
          "3年以上树脂研发工作经验，熟悉汽车涂料行业者优先",
          "掌握树脂合成工艺和配方设计，能独立开展研发工作",
          "熟悉各类检测仪器和实验设备的操作",
          "具备良好的沟通能力和团队协作精神",
          "英语四级以上，能阅读英文技术资料",
        ]),
        responsibilities: JSON.stringify([
          "负责丙烯酸树脂、聚酯树脂、氨基树脂等产品的配方开发",
          "针对汽车内外饰件和原厂漆应用进行树脂性能优化",
          "制定和实施新产品研发计划，完成项目开发任务",
          "编写产品技术文档、工艺文件和质量标准",
          "配合生产和销售部门解决技术问题，提供技术支持",
          "跟踪行业技术发展动态，提出创新性技术方案",
        ]),
        is_active: true,
      },
      {
        position: "DCS控制工程师",
        department: "生产部",
        location: "星火工业园",
        type: "full_time",
        experience_requirement: "2-4年经验",
        description:
          "负责DCS自动化控制系统的运行维护，确保生产设备安全稳定运行，优化生产工艺参数。",
        requirements: JSON.stringify([
          "自动化、化工机械、过程控制等相关专业大专及以上学历",
          "2年以上DCS系统操作维护经验，熟悉化工生产工艺",
          "掌握DCS系统的硬件结构、软件配置和编程方法",
          "具备化工工艺基础知识和安全意识",
          "能适应倒班工作，具备良好的应急处理能力",
          "持有相关资格证书者优先",
        ]),
        responsibilities: JSON.stringify([
          "负责DCS系统的日常监控、操作和维护工作",
          "监控生产过程中的关键参数，及时调整工艺条件",
          "处理DCS系统故障和报警，确保生产安全稳定",
          "参与新设备的调试、验收和员工培训工作",
          "优化控制方案，提高产品质量和生产效率",
          "记录运行数据，编写技术报告和改进建议",
        ]),
        is_active: true,
      },
      {
        position: "涂料销售工程师",
        department: "销售部",
        location: "全国（华东、华南、华北）",
        type: "full_time",
        experience_requirement: "2-3年经验",
        description:
          "负责公司在涂料行业的树脂产品销售，重点开发汽车原厂漆、工业漆等领域的客户资源。",
        requirements: JSON.stringify([
          "市场营销、化工或相关专业大专以上学历",
          "2年以上化工产品销售经验，有涂料行业背景者优先",
          "熟悉汽车涂料或工业涂料市场，了解客户需求",
          "具备较强的市场开拓能力和客户沟通技巧",
          "能适应频繁出差，工作积极主动",
          "具备良好的团队合作精神和抗压能力",
        ]),
        responsibilities: JSON.stringify([
          "负责指定区域的涂料市场开发和客户维护工作",
          "推广公司丙烯酸树脂、聚酯树脂等产品，完成销售目标",
          "深入了解客户需求，提供定制化的产品解决方案",
          "收集市场信息，分析竞争对手动态，制定销售策略",
          "参与商务谈判，处理客户投诉和售后服务",
          "配合技术部门为客户提供技术支持和服务",
        ]),
        is_active: true,
      },
      {
        position: "质量检验员",
        department: "质控部",
        location: "星火工业园",
        type: "full_time",
        experience_requirement: "1-3年经验",
        description:
          "负责原材料、半成品和成品的质量检验，确保产品质量符合标准要求。",
        requirements: JSON.stringify([
          "化工、质量管理等相关专业中专或以上学历",
          "1年以上化工产品质量检验经验",
          "熟悉各类检测仪器的操作和维护",
          "了解ISO9001质量管理体系要求",
          "工作认真负责，具备良好的质量意识",
          "能适应实验室工作环境",
        ]),
        responsibilities: JSON.stringify([
          "负责原材料进厂检验，确保符合采购技术要求",
          "进行生产过程监控和半成品质量检验",
          "完成成品出厂检验，出具质量检验报告",
          "操作和维护检验设备，确保仪器正常运行",
          "参与质量问题的分析和处理，提出改进建议",
          "整理质量记录，维护质量管理体系文件",
        ]),
        is_active: true,
      },
      {
        position: "生产操作工",
        department: "生产部",
        location: "星火工业园",
        type: "full_time",
        experience_requirement: "1-2年经验",
        description:
          "负责树脂生产设备的操作，按照工艺要求进行生产作业，确保产品质量和生产安全。",
        requirements: JSON.stringify([
          "化工、机械或相关专业中专、技校学历",
          "1年以上化工生产操作经验者优先",
          "了解基本的化工工艺和安全知识",
          "能适应倒班工作，具备良好的身体素质",
          "工作责任心强，严格遵守操作规程",
          "具备团队协作精神和学习能力",
        ]),
        responsibilities: JSON.stringify([
          "严格按照工艺文件和操作规程进行生产作业",
          "监控生产设备运行状态，及时发现和处理异常情况",
          "准确记录生产数据和操作参数",
          "参与设备的日常维护保养工作",
          "遵守安全生产制度，确保生产安全和环保",
          "配合完成生产计划，保证产品质量和产量",
        ]),
        is_active: true,
      },
      {
        position: "环保技术员",
        department: "环保安全部",
        location: "星火工业园",
        type: "full_time",
        experience_requirement: "2-4年经验",
        description:
          "负责公司环保设施的运行管理，确保废水、废气、固废处理达标排放，推进清洁生产。",
        requirements: JSON.stringify([
          "环境工程、化工等相关专业大专及以上学历",
          "2年以上化工企业环保管理经验",
          "熟悉环保法律法规和相关标准要求",
          "掌握三废处理工艺和设备的操作维护",
          "具备环境监测和数据分析能力",
          "持有环保相关资格证书者优先",
        ]),
        responsibilities: JSON.stringify([
          "负责废水、废气处理设施的日常运行和维护",
          "定期监测污染物排放数据，确保达标排放",
          "制定和实施环境保护措施，推进清洁生产",
          "处理环保投诉和应急事件，配合环保检查",
          "管理危险废物，确保合规处置",
          "编写环保报告，持续改进环境管理体系",
        ]),
        is_active: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${careers.count} career positions`);

  // 初始化RBAC权限系统
  console.log("\n开始初始化RBAC权限系统...");

  // 创建基础权限
  const permissions = [
    // 用户管理权限
    {
      name: "user.read",
      display_name: "查看用户",
      module: "user",
      action: "read",
      resource: "all",
    },
    {
      name: "user.create",
      display_name: "创建用户",
      module: "user",
      action: "create",
      resource: "all",
    },
    {
      name: "user.update",
      display_name: "更新用户",
      module: "user",
      action: "update",
      resource: "all",
    },
    {
      name: "user.delete",
      display_name: "删除用户",
      module: "user",
      action: "delete",
      resource: "all",
    },
    {
      name: "user.read.own",
      display_name: "查看自己的信息",
      module: "user",
      action: "read",
      resource: "own",
    },
    {
      name: "user.update.own",
      display_name: "更新自己的信息",
      module: "user",
      action: "update",
      resource: "own",
    },

    // 角色管理权限
    {
      name: "role.read",
      display_name: "查看角色",
      module: "role",
      action: "read",
      resource: "all",
    },
    {
      name: "role.create",
      display_name: "创建角色",
      module: "role",
      action: "create",
      resource: "all",
    },
    {
      name: "role.update",
      display_name: "更新角色",
      module: "role",
      action: "update",
      resource: "all",
    },
    {
      name: "role.delete",
      display_name: "删除角色",
      module: "role",
      action: "delete",
      resource: "all",
    },
    {
      name: "role.assign",
      display_name: "分配角色",
      module: "role",
      action: "assign",
      resource: "all",
    },

    // 产品管理权限
    {
      name: "product.read",
      display_name: "查看产品",
      module: "product",
      action: "read",
      resource: "all",
    },
    {
      name: "product.create",
      display_name: "创建产品",
      module: "product",
      action: "create",
      resource: "all",
    },
    {
      name: "product.update",
      display_name: "更新产品",
      module: "product",
      action: "update",
      resource: "all",
    },
    {
      name: "product.delete",
      display_name: "删除产品",
      module: "product",
      action: "delete",
      resource: "all",
    },

    // 新闻管理权限
    {
      name: "news.read",
      display_name: "查看新闻",
      module: "news",
      action: "read",
      resource: "all",
    },
    {
      name: "news.create",
      display_name: "创建新闻",
      module: "news",
      action: "create",
      resource: "all",
    },
    {
      name: "news.update",
      display_name: "更新新闻",
      module: "news",
      action: "update",
      resource: "all",
    },
    {
      name: "news.delete",
      display_name: "删除新闻",
      module: "news",
      action: "delete",
      resource: "all",
    },
    {
      name: "news.publish",
      display_name: "发布新闻",
      module: "news",
      action: "publish",
      resource: "all",
    },

    // 招聘管理权限
    {
      name: "career.read",
      display_name: "查看招聘",
      module: "career",
      action: "read",
      resource: "all",
    },
    {
      name: "career.create",
      display_name: "创建招聘",
      module: "career",
      action: "create",
      resource: "all",
    },
    {
      name: "career.update",
      display_name: "更新招聘",
      module: "career",
      action: "update",
      resource: "all",
    },
    {
      name: "career.delete",
      display_name: "删除招聘",
      module: "career",
      action: "delete",
      resource: "all",
    },

    // 系统管理权限
    {
      name: "system.dashboard",
      display_name: "访问仪表板",
      module: "system",
      action: "dashboard",
      resource: "all",
    },
    {
      name: "system.audit",
      display_name: "查看审计日志",
      module: "system",
      action: "audit",
      resource: "all",
    },
    {
      name: "system.settings",
      display_name: "系统设置",
      module: "system",
      action: "settings",
      resource: "all",
    },
  ];

  console.log("创建权限...");
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: permission,
      create: {
        ...permission,
        is_system: true,
      },
    });
  }

  // 创建基础角色
  const roles = [
    {
      name: "super_admin",
      display_name: "超级管理员",
      description: "拥有系统所有权限的超级管理员",
      level: 100,
      is_system: true,
    },
    {
      name: "admin",
      display_name: "管理员",
      description: "系统管理员，拥有大部分管理权限",
      level: 80,
      is_system: true,
    },
    {
      name: "editor",
      display_name: "编辑员",
      description: "内容编辑员，可以管理产品和新闻",
      level: 50,
      is_system: true,
    },
    {
      name: "user",
      display_name: "普通用户",
      description: "普通用户，只能查看和修改自己的信息",
      level: 10,
      is_system: true,
    },
  ];

  console.log("创建角色...");
  const createdRoles = [];
  for (const role of roles) {
    const createdRole = await prisma.role.upsert({
      where: { name: role.name },
      update: role,
      create: role,
    });
    createdRoles.push(createdRole);
  }

  // 为角色分配权限
  console.log("为角色分配权限...");

  // 超级管理员拥有所有权限
  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        role_id_permission_id: {
          role_id: createdRoles.find((r: any) => r.name === "super_admin")!.id,
          permission_id: permission.id,
        },
      },
      update: {},
      create: {
        role_id: createdRoles.find((r: any) => r.name === "super_admin")!.id,
        permission_id: permission.id,
      },
    });
  }

  // 管理员权限（除了用户删除和角色管理之外的所有权限）
  const adminPermissions = allPermissions.filter(
    (p) =>
      !p.name.includes("user.delete") &&
      !p.name.includes("role.delete") &&
      !p.name.includes("system.settings")
  );
  for (const permission of adminPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        role_id_permission_id: {
          role_id: createdRoles.find((r: any) => r.name === "admin")!.id,
          permission_id: permission.id,
        },
      },
      update: {},
      create: {
        role_id: createdRoles.find((r: any) => r.name === "admin")!.id,
        permission_id: permission.id,
      },
    });
  }

  // 编辑员权限（产品和新闻管理）
  const editorPermissions = allPermissions.filter(
    (p) =>
      p.module === "product" ||
      p.module === "news" ||
      p.name === "system.dashboard"
  );
  for (const permission of editorPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        role_id_permission_id: {
          role_id: createdRoles.find((r: any) => r.name === "editor")!.id,
          permission_id: permission.id,
        },
      },
      update: {},
      create: {
        role_id: createdRoles.find((r: any) => r.name === "editor")!.id,
        permission_id: permission.id,
      },
    });
  }

  // 普通用户权限（只能查看和修改自己的信息）
  const userPermissions = allPermissions.filter(
    (p) => p.name === "user.read.own" || p.name === "user.update.own"
  );
  for (const permission of userPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        role_id_permission_id: {
          role_id: createdRoles.find((r: any) => r.name === "user")!.id,
          permission_id: permission.id,
        },
      },
      update: {},
      create: {
        role_id: createdRoles.find((r: any) => r.name === "user")!.id,
        permission_id: permission.id,
      },
    });
  }

  console.log("RBAC权限系统初始化完成！");

  // 创建初始用户并分配角色
  console.log("\n创建初始用户...");
  const bcrypt = require("bcrypt");
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@unicechemical.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@unicechemical.com",
      password_hash: hashedPassword,
      role: "administrator",
      first_name: "系统",
      last_name: "管理员",
      is_active: true,
    },
  });

  // 为超级管理员用户分配super_admin角色
  const superAdminRole = createdRoles.find(
    (r: any) => r.name === "super_admin"
  )!;
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
  });

  console.log(`Created user: ${adminUser.username} with super_admin role`);

  console.log("\n🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
