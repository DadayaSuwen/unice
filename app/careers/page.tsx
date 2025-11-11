'use client';

import { useState } from 'react';

export default function CareersPage() {
  // 招聘职位数据模拟
  const [jobs] = useState([
    {
      id: 1,
      position: "高级研发工程师",
      department: "研发部",
      location: "北京总部",
      type: "全职",
      experience: "3-5年经验",
      description: "负责化工产品的新品研发和工艺改进工作，参与技术方案制定。",
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
      description: "负责化工产品的市场推广和客户关系维护，完成销售目标。",
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
      location: "北京总部",
      type: "全职",
      experience: "2-4年经验",
      description: "负责产品质量控制体系的建立和实施，确保产品质量符合标准。",
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
      location: "北京工厂",
      type: "全职",
      experience: "3-5年经验",
      description: "负责生产车间的日常运营管理，确保生产计划的顺利执行。",
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

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[var(--main-purple)] to-[var(--tech-blue)] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">加入我们</h1>
          <p className="mt-2 text-lg opacity-90">寻找志同道合的人才，共创美好未来</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="mb-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-[var(--main-purple)] mb-4">为什么选择联合化工？</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[var(--main-purple)] rounded-full flex items-center justify-center flex-shrink-0 mr-4 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">职业发展</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  完善的培训体系和晋升机制，助力员工实现职业梦想。
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[var(--main-purple)] rounded-full flex items-center justify-center flex-shrink-0 mr-4 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">工作环境</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  现代化的办公环境和完善的基础设施，提供舒适的工作体验。
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[var(--main-purple)] rounded-full flex items-center justify-center flex-shrink-0 mr-4 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">团队文化</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  开放包容的企业文化，鼓励创新和团队合作。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Openings */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--main-purple)] mb-6">当前招聘职位</h2>

          <div className="space-y-6">
            {jobs.map(job => (
              <div key={job.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                      <h3 className="text-xl font-bold text-[var(--main-purple)] mb-1">{job.position}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                          {job.department}
                        </span>
                        <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                          {job.location}
                        </span>
                        <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                          {job.type}
                        </span>
                        <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                          {job.experience}
                        </span>
                      </div>
                    </div>
                    <button className="mt-4 md:mt-0 bg-[var(--main-purple)] hover:bg-[var(--tech-blue)] text-white px-6 py-2 rounded-lg transition-colors">
                      申请职位
                    </button>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mt-4 mb-6">{job.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-[var(--main-purple)] mb-3">岗位职责：</h4>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                        {job.responsibilities.slice(0, 3).map((resp, index) => (
                          <li key={index}>{resp}</li>
                        ))}
                        {job.responsibilities.length > 3 && (
                          <li className="text-[var(--main-purple)]">...</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--main-purple)] mb-3">任职要求：</h4>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                        {job.requirements.length > 3 && (
                          <li className="text-[var(--main-purple)]">...</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Process */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-[var(--main-purple)] mb-6">应聘流程</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--main-purple)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold mb-2">简历投递</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                通过公司官网或邮箱投递简历
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--main-purple)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold mb-2">初步筛选</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                人力资源部门进行简历筛选
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--main-purple)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold mb-2">面试评估</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                安排面试环节，综合评估候选人
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--main-purple)] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="font-semibold mb-2">发放Offer</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                发放录用通知，安排入职事宜
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}