// 新闻类型映射函数
export function getNewsTypeDisplayName(type?: string): string {
  const typeMap: { [key: string]: string } = {
    company: "企业动态",
    enterprise: "企业动态",
    industry: "行业资讯",
    product: "产品发布",
    announcement: "公告",
    news: "新闻",
    article: "文章",
    update: "更新",
    event: "活动",
    技术: "技术资讯",
    tech: "技术资讯",
    technology: "技术资讯",
    market: "市场动态",
    research: "研发动态",
    partnership: "合作资讯",
    award: "荣誉奖项",
    sustainability: "可持续发展",
    innovation: "创新资讯",
    case: "案例研究",
    report: "报告",
    interview: "专访",
    press: "媒体报道",
    release: "发布",
    highlight: "亮点",
    feature: "专题",
    breaking: "突发新闻",
    weekly: "周报",
    monthly: "月报",
    quarterly: "季度报告",
    annual: "年度报告",
    financial: "财务报告",
    csr: "社会责任",
    esg: "ESG报告",
    quality: "质量认证",
    safety: "安全资讯",
    environment: "环保资讯",
    energy: "能源资讯",
    chemical: "化工资讯",
    material: "材料资讯",
    equipment: "设备资讯",
    process: "工艺资讯",
    application: "应用资讯",
    solution: "解决方案",
    service: "服务资讯",
    support: "技术支持",
    training: "培训资讯",
    career: "招聘信息",
    hr: "人力资源",
    culture: "企业文化",
    history: "企业历史",
    vision: "愿景规划",
    mission: "使命担当",
    value: "价值观",
    philosophy: "经营理念",
    strategy: "战略规划",
    development: "发展动态",
    expansion: "扩张资讯",
    investment: "投资资讯",
    merger: "并购资讯",
    acquisition: "收购资讯",
    joint: "合资资讯",
    venture: "投资资讯",
    startup: "创业资讯",
    digital: "数字化转型",
    smart: "智能制造",
    automation: "自动化资讯",
    ai: "人工智能",
    iot: "物联网",
    blockchain: "区块链",
    bigdata: "大数据",
    cloud: "云计算",
    cybersecurity: "网络安全",
    standard: "标准规范",
    regulation: "法规资讯",
    policy: "政策解读",
    trend: "趋势分析",
    forecast: "市场预测",
    analysis: "深度分析",
    insight: "行业洞察",
    perspective: "观点评论",
    expert: "专家观点",
    leader: "领导讲话",
    speech: "演讲致辞",
    statement: "声明公告",
    notice: "通知公告",
    reminder: "温馨提示",
    warning: "风险提示",
    alert: "紧急公告",
  };

  // 如果没有类型或者类型不在映射中，返回默认值
  if (!type) {
    return "新闻";
  }

  // 将类型转换为小写进行匹配
  const lowerType = type.toLowerCase();

  // 精确匹配
  if (typeMap[lowerType]) {
    return typeMap[lowerType];
  }

  // 模糊匹配
  for (const [key, value] of Object.entries(typeMap)) {
    if (lowerType.includes(key) || key.includes(lowerType)) {
      return value;
    }
  }

  // 如果都没有匹配到，返回原始类型（中文优先）
  if (/[\u4e00-\u9fa5]/.test(type)) {
    return type; // 如果已经是中文，直接返回
  }

  // 最后的默认值
  return "新闻";
}

// 获取新闻类型的CSS类名
export function getNewsTypeClassName(type?: string): string {
  if (!type) {
    return "type-default";
  }

  return "type-default";
}
