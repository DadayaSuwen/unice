"use client";

import { useState, useEffect } from "react";

interface Job {
  id: number;
  position: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
}

export default function CareersPage() {
  const [jobs] = useState<Job[]>([
    {
      id: 1,
      position: "高级研发工程师",
      department: "研发部",
      location: "上海总部",
      type: "全职",
      experience: "3-5年经验",
      description: "负责化工产品的新品研发和工艺改进工作，参与技术方案制定，推动技术创新。",
      requirements: [
        "化工、材料等相关专业本科及以上学历",
        "3年以上化工研发工作经验",
        "熟悉化工工艺流程和设备",
        "具备良好的沟通能力和团队协作精神",
        "英语读写能力良好"
      ],
      responsibilities: [
        "新产品开发和实验设计",
        "生产工艺优化和改进",
        "技术文档编写和整理",
        "协助解决生产中的技术问题",
        "参与技术交流和培训"
      ]
    },
    {
      id: 2,
      position: "销售经理",
      department: "销售部",
      location: "全国",
      type: "全职",
      experience: "2-3年经验",
      description: "负责化工产品的市场推广和客户关系维护，制定销售策略，完成销售目标。",
      requirements: [
        "市场营销或化工相关专业大专以上学历",
        "2年以上化工产品销售经验",
        "具备较强的沟通表达能力和谈判技巧",
        "熟悉化工行业市场状况",
        "能适应出差"
      ],
      responsibilities: [
        "开发和维护客户资源",
        "制定销售计划和策略",
        "完成个人及团队销售目标",
        "参与商务谈判和合同签订",
        "收集市场信息和竞争对手情报"
      ]
    },
    {
      id: 3,
      position: "质量工程师",
      department: "质控部",
      location: "上海总部",
      type: "全职",
      experience: "2-4年经验",
      description: "负责产品质量控制体系的建立和实施，确保产品质量符合国际标准和客户要求。",
      requirements: [
        "化学、化工或质量管理相关专业",
        "2年以上质量管理工作经验",
        "熟悉ISO质量管理体系",
        "具备良好的数据分析能力",
        "工作认真负责，原则性强"
      ],
      responsibilities: [
        "制定质量控制标准和流程",
        "执行产品质量检测和评估",
        "分析质量问题并提出改进建议",
        "参与质量管理体系审核",
        "培训和指导相关人员"
      ]
    },
    {
      id: 4,
      position: "生产主管",
      department: "生产部",
      location: "上海工厂",
      type: "全职",
      experience: "3-5年经验",
      description: "负责生产车间的日常运营管理，优化生产流程，确保生产计划的高效执行。",
      requirements: [
        "化工或机械相关专业",
        "3年以上生产管理经验",
        "熟悉化工生产工艺流程",
        "具备良好的组织协调能力",
        "能接受倒班制度"
      ],
      responsibilities: [
        "制定生产计划并组织实施",
        "监督生产过程质量控制",
        "管理生产人员和设备",
        "优化生产工艺提高效率",
        "确保安全生产和环保要求"
      ]
    }
  ]);

  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const toggleJobExpansion = (jobId: number) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  return (
    <div className="app-wrapper">
      {/* Hero Section */}
      <section className="hero-section-careers">
        <div className="container-small">
          <div className={`hero-content-careers ${isLoaded ? "loaded" : ""}`}>
            <h1 className="page-title">加入我们</h1>
            <p className="page-subtitle">
              寻找志同道合的优秀人才，在联合化工开启您的职业新征程
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="why-join-section">
        <div className="container">
          <div className={`why-join-content ${isLoaded ? "loaded" : ""}`}>
            <h2 className="section-title">为什么选择联合化工？</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="apple-icon-wrapper gold">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="benefit-title">职业发展</h3>
                <p className="benefit-description">
                  完善的培训体系和晋升机制，助力员工实现职业梦想，与企业共同成长。
                </p>
              </div>

              <div className="benefit-card">
                <div className="apple-icon-wrapper gold">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="benefit-title">工作环境</h3>
                <p className="benefit-description">
                  现代化的办公环境和完善的基础设施，提供舒适高效的工作体验。
                </p>
              </div>

              <div className="benefit-card">
                <div className="apple-icon-wrapper gold">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="benefit-title">团队文化</h3>
                <p className="benefit-description">
                  开放包容的企业文化，鼓励创新思维和团队合作，营造积极向上的工作氛围。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section className="job-openings-section">
        <div className="container">
          <div className={`job-openings-content ${isLoaded ? "loaded" : ""}`}>
            <h2 className="section-title">当前招聘职位</h2>
            <div className="jobs-grid">
              {jobs.map((job, index) => (
                <div
                  key={job.id}
                  className="job-card"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="job-header">
                    <div className="job-info">
                      <h3 className="job-position">{job.position}</h3>
                      <div className="job-meta">
                        <span className="job-tag">{job.department}</span>
                        <span className="job-tag">{job.location}</span>
                        <span className="job-tag">{job.type}</span>
                        <span className="job-tag">{job.experience}</span>
                      </div>
                    </div>
                    <div className="job-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  <p className="job-description">{job.description}</p>

                  <div className="job-details">
                    <div className="job-detail-column">
                      <h4 className="job-detail-title">岗位职责</h4>
                      <ul className="job-detail-list">
                        {job.responsibilities.slice(0, 3).map((resp, idx) => (
                          <li key={idx}>{resp}</li>
                        ))}
                        {job.responsibilities.length > 3 && (
                          <li className="job-detail-more">...</li>
                        )}
                      </ul>
                    </div>
                    <div className="job-detail-column">
                      <h4 className="job-detail-title">任职要求</h4>
                      <ul className="job-detail-list">
                        {job.requirements.slice(0, 3).map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                        {job.requirements.length > 3 && (
                          <li className="job-detail-more">...</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="job-actions">
                    <button
                      className="job-expand-button"
                      onClick={() => toggleJobExpansion(job.id)}
                    >
                      {expandedJob === job.id ? "收起详情" : "查看详情"}
                      <svg
                        className={`button-arrow ${expandedJob === job.id ? "rotated" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button className="job-apply-button">
                      申请职位
                      <svg className="button-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {expandedJob === job.id && (
                    <div className="job-expanded-details">
                      <div className="job-expanded-section">
                        <h4 className="job-expanded-title">完整岗位职责</h4>
                        <ul className="job-expanded-list">
                          {job.responsibilities.map((resp, idx) => (
                            <li key={idx}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="job-expanded-section">
                        <h4 className="job-expanded-title">完整任职要求</h4>
                        <ul className="job-expanded-list">
                          {job.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="job-accent-line"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      <section className="application-process-section">
        <div className="container">
          <div className={`process-content ${isLoaded ? "loaded" : ""}`}>
            <h2 className="section-title">应聘流程</h2>
            <div className="process-steps">
              <div className="process-step">
                <div className="process-icon">
                  <span className="process-number">1</span>
                </div>
                <h3 className="process-title">简历投递</h3>
                <p className="process-description">
                  通过公司官网或招聘邮箱投递简历，我们会在收到后尽快回复
                </p>
              </div>

              <div className="process-step">
                <div className="process-icon">
                  <span className="process-number">2</span>
                </div>
                <h3 className="process-title">初步筛选</h3>
                <p className="process-description">
                  人力资源部门对简历进行专业筛选，匹配最合适的职位
                </p>
              </div>

              <div className="process-step">
                <div className="process-icon">
                  <span className="process-number">3</span>
                </div>
                <h3 className="process-title">面试评估</h3>
                <p className="process-description">
                  安排多轮面试环节，全面评估候选人的专业能力和综合素质
                </p>
              </div>

              <div className="process-step">
                <div className="process-icon">
                  <span className="process-number">4</span>
                </div>
                <h3 className="process-title">发放Offer</h3>
                <p className="process-description">
                  发放正式录用通知，安排入职培训和后续职业发展规划
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}