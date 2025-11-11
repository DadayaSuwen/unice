'use client';

import { useState } from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[var(--main-purple)] to-[var(--tech-blue)] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold">关于我们</h1>
          <p className="mt-2 text-lg opacity-90">了解联合化工的企业文化与发展历程</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Company Introduction */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-2xl font-bold text-[var(--main-purple)] mb-4">公司简介</h2>
              <p className="text-gray-700 dark:text-gray-200 mb-4">
                联合化工成立于2003年，是一家专业从事化工产品研发、生产和销售的高新技术企业。
              </p>
              <p className="text-gray-700 dark:text-gray-200 mb-4">
                我们致力于为客户提供高品质的化工产品和专业的技术服务，在行业内享有良好声誉。
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                公司拥有先进的生产设备和技术团队，严格按照国际标准进行质量管控，产品远销海内外。
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-r from-[var(--main-purple)] to-[var(--tech-blue)] rounded-lg h-80 flex items-center justify-center">
                <span className="text-white text-xl font-bold">公司形象图</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-[var(--main-purple)] mb-4">公司使命</h3>
            <p className="text-gray-700 dark:text-gray-200">
              通过提供高质量的化工产品和专业的技术服务，为客户创造价值，推动行业发展。
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-[var(--main-purple)] mb-4">公司愿景</h3>
            <p className="text-gray-700 dark:text-gray-200">
              成为全球领先的化工产品供应商，引领行业技术创新和可持续发展。
            </p>
          </div>
        </div>

        {/* History Timeline */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--main-purple)] mb-8 text-center">发展历程</h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[var(--main-purple)] hidden md:block"></div>

            <div className="space-y-8">
              {/* 2003 - Company Founded */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-4 md:mb-0 md:pr-8 text-right">
                  <div className="inline-block bg-[var(--main-purple)] text-white px-4 py-2 rounded-lg">
                    2003年
                  </div>
                  <h3 className="text-xl font-semibold mt-2">公司成立</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    联合化工正式注册成立，专注于化工产品的研发与生产。
                  </p>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <div className="w-6 h-6 bg-[var(--main-purple)] rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div className="md:w-1/2 hidden md:block"></div>
              </div>

              {/* 2008 - First Factory */}
              <div className="flex flex-col md:flex-row-reverse items-center">
                <div className="md:w-1/2 mb-4 md:mb-0 md:pl-8 text-left">
                  <div className="inline-block bg-[var(--main-purple)] text-white px-4 py-2 rounded-lg">
                    2008年
                  </div>
                  <h3 className="text-xl font-semibold mt-2">建立第一个生产基地</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    建立占地5000平方米的现代化生产基地，提升生产能力。
                  </p>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <div className="w-6 h-6 bg-[var(--main-purple)] rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div className="md:w-1/2 hidden md:block"></div>
              </div>

              {/* 2015 - International Certification */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-4 md:mb-0 md:pr-8 text-right">
                  <div className="inline-block bg-[var(--main-purple)] text-white px-4 py-2 rounded-lg">
                    2015年
                  </div>
                  <h3 className="text-xl font-semibold mt-2">获得国际认证</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    通过ISO9001质量管理体系认证和ISO14001环境管理体系认证。
                  </p>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <div className="w-6 h-6 bg-[var(--main-purple)] rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div className="md:w-1/2 hidden md:block"></div>
              </div>

              {/* 2020 - Digital Transformation */}
              <div className="flex flex-col md:flex-row-reverse items-center">
                <div className="md:w-1/2 mb-4 md:mb-0 md:pl-8 text-left">
                  <div className="inline-block bg-[var(--main-purple)] text-white px-4 py-2 rounded-lg">
                    2020年
                  </div>
                  <h3 className="text-xl font-semibold mt-2">数字化转型</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    全面推进数字化管理，引入ERP系统和智能化生产装备。
                  </p>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <div className="w-6 h-6 bg-[var(--main-purple)] rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div className="md:w-1/2 hidden md:block"></div>
              </div>

              {/* 2023 - Global Expansion */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-4 md:mb-0 md:pr-8 text-right">
                  <div className="inline-block bg-[var(--main-purple)] text-white px-4 py-2 rounded-lg">
                    2023年
                  </div>
                  <h3 className="text-xl font-semibold mt-2">全球化发展</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    成功进入东南亚市场，设立海外销售办事处，实现国际化经营。
                  </p>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <div className="w-6 h-6 bg-[var(--main-purple)] rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div className="md:w-1/2 hidden md:block"></div>
              </div>
            </div>
          </div>
        </div>

        {/* R&D Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--main-purple)] mb-8 text-center">研发与技术</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-[var(--main-purple)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">技术研发</h3>
              <p className="text-gray-600 dark:text-gray-300">
                拥有专业的研发团队，不断开发新产品，提升技术水平。
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-[var(--main-purple)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">质量认证</h3>
              <p className="text-gray-600 dark:text-gray-300">
                通过多项国际质量认证，确保产品质量达到世界先进水平。
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-[var(--main-purple)] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">专家团队</h3>
              <p className="text-gray-600 dark:text-gray-300">
                汇聚国内外化工领域顶尖专家，为产品研发提供强大支持。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}