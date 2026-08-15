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
  application_deadline?: string;
  created_at: string;
  updated_at: string;
}

interface PageHeader {
  enabled: boolean;
  title: string;
  subtitle: string;
}

const DEFAULT_TITLE = "加入我们";
const DEFAULT_LOADING_SUBTITLE =
  "江西联合化工有限公司成立于2002年，专注树脂研发生产20余年，诚邀优秀人才加入星火工业园团队";
const DEFAULT_MAIN_SUBTITLE =
  "寻找志同道合的优秀人才，在江西联合化工开启您的职业新征程";

export default function CareersClient({ pageHeader }: { pageHeader: PageHeader }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);

    const fetchCareers = async () => {
      try {
        const response = await fetch("/api/careers");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch careers");
        }

        setJobs(data);
        setLoading(false);
      } catch (err) {
        console.error("获取招聘信息失败:", err);
        setError("获取招聘信息失败");
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  const toggleJobExpansion = (jobId: number) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  const handleApply = (job: Job) => {
    // 创建邮件主题
    const subject = encodeURIComponent(
      `应聘${job.position} - ${job.department}`
    );
    const body = encodeURIComponent(
      `尊敬的江西联合化工有限公司招聘团队：

我想应聘贵公司的${job.position}职位。

个人信息：
- 应聘职位：${job.position}
- 所属部门：${job.department}
- 工作地点：${job.location}
- 工作类型：${job.type}

请查收我的简历，期待您的回复。

此致
敬礼！`
    );

    // 打开邮件客户端
    window.location.href = `mailto:1179002658@qq.com?subject=${subject}&body=${body}`;
  };

  const heroTitle = pageHeader.enabled ? pageHeader.title : DEFAULT_TITLE;
  const loadingHeroSubtitle = pageHeader.enabled
    ? pageHeader.subtitle
    : DEFAULT_LOADING_SUBTITLE;
  const mainHeroSubtitle = pageHeader.enabled
    ? pageHeader.subtitle
    : DEFAULT_MAIN_SUBTITLE;

  if (loading) {
    return (
      <div className="app-wrapper">
        {/* Hero Section */}
        <section className="hero-section-careers">
          <div className="container-small">
            <div className={`hero-content-careers ${isLoaded ? "loaded" : ""}`}>
              <h1 className="page-title">{heroTitle}</h1>
              <p className="page-subtitle">
                {loadingHeroSubtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Loading State */}
        <section className="job-openings-section">
          <div className="container">
            <div className="careers-loading">
              <div className="loading-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-dot"></div>
              </div>
              <p className="loading-text">加载职位信息中...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-wrapper">
        {/* Hero Section */}
        <section className="hero-section-careers">
          <div className="container-small">
            <div className={`hero-content-careers ${isLoaded ? "loaded" : ""}`}>
              <h1 className="page-title">{heroTitle}</h1>
              <p className="page-subtitle">
                {loadingHeroSubtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Error State */}
        <section className="job-openings-section">
          <div className="container">
            <div className="careers-error">
              <div className="error-card">
                <div className="error-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <p className="error-message">{error}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      {/* Hero Section */}
      <section className="hero-section-careers">
        <div className="container-small">
          <div className={`hero-content-careers ${isLoaded ? "loaded" : ""}`}>
            <h1 className="page-title">{heroTitle}</h1>
            <p className="page-subtitle">
              {mainHeroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="why-join-section">
        <div className="container">
          <div className={`why-join-content ${isLoaded ? "loaded" : ""}`}>
            <h2 className="section-title">为什么选择江西联合化工？</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="apple-icon-wrapper gold">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="benefit-title">专业技术发展</h3>
                <p className="benefit-description">
                  专注树脂研发20余年，提供深入的技术培训和发展机会，在汽车涂料和原厂漆领域积累专业经验。
                </p>
              </div>

              <div className="benefit-card">
                <div className="apple-icon-wrapper gold">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="benefit-title">工作环境</h3>
                <p className="benefit-description">
                  现代化的办公环境和完善的基础设施，提供舒适高效的工作体验。
                </p>
              </div>

              <div className="benefit-card">
                <div className="apple-icon-wrapper gold">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
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
                        {job.application_deadline && (
                          <span className="job-tag deadline">
                            截止:{" "}
                            {new Date(
                              job.application_deadline
                            ).toLocaleDateString("zh-CN")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="job-icon">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>

                  <p className="job-description">{job.description}</p>

                  <div className="job-details">
                    <div className="job-detail-column">
                      <h4 className="job-detail-title">岗位职责</h4>
                      <ul className="job-detail-list">
                        {Array.isArray(job.responsibilities) &&
                          job.responsibilities
                            .slice(0, 3)
                            .map((resp, idx) => <li key={idx}>{resp}</li>)}
                        {Array.isArray(job.responsibilities) &&
                          job.responsibilities.length > 3 && (
                            <li className="job-detail-more">...</li>
                          )}
                        {!Array.isArray(job.responsibilities) && (
                          <li>岗位职责信息加载中...</li>
                        )}
                      </ul>
                    </div>
                    <div className="job-detail-column">
                      <h4 className="job-detail-title">任职要求</h4>
                      <ul className="job-detail-list">
                        {Array.isArray(job.requirements) &&
                          job.requirements
                            .slice(0, 3)
                            .map((req, idx) => <li key={idx}>{req}</li>)}
                        {Array.isArray(job.requirements) &&
                          job.requirements.length > 3 && (
                            <li className="job-detail-more">...</li>
                          )}
                        {!Array.isArray(job.requirements) && (
                          <li>任职要求信息加载中...</li>
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
                        className={`button-arrow ${
                          expandedJob === job.id ? "rotated" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <button
                      className="job-apply-button"
                      onClick={() => handleApply(job)}
                    >
                      申请职位
                      <svg
                        className="button-arrow"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>

                  {expandedJob === job.id && (
                    <div className="job-expanded-details">
                      <div className="job-expanded-section">
                        <h4 className="job-expanded-title">完整岗位职责</h4>
                        <ul className="job-expanded-list">
                          {Array.isArray(job.responsibilities) ? (
                            job.responsibilities.map((resp, idx) => (
                              <li key={idx}>{resp}</li>
                            ))
                          ) : (
                            <li>岗位职责信息加载中...</li>
                          )}
                        </ul>
                      </div>
                      <div className="job-expanded-section">
                        <h4 className="job-expanded-title">完整任职要求</h4>
                        <ul className="job-expanded-list">
                          {Array.isArray(job.requirements) ? (
                            job.requirements.map((req, idx) => (
                              <li key={idx}>{req}</li>
                            ))
                          ) : (
                            <li>任职要求信息加载中...</li>
                          )}
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
