"use client";

import { useState, useEffect } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 这里应该提交表单数据到后端
    alert("感谢您的留言！我们会尽快回复您。");
    // 重置表单
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    });
  };

  return (
    <div className="app-wrapper">
      {/* Hero Section */}
      <section className="hero-section-contact">
        <div className="container-small">
          <div className={`hero-content-contact ${isLoaded ? "loaded" : ""}`}>
            <h1 className="page-title">联系我们</h1>
            <p className="page-subtitle">
              期待与您的合作与交流，我们将竭诚为您提供专业的化工产品解决方案
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-main-section">
        <div className="container">
          <div className={`contact-content ${isLoaded ? "loaded" : ""}`}>
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2 className="section-title">发送消息</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      姓名 *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="请输入您的姓名"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      邮箱 *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="请输入您的邮箱"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      电话
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="请输入您的联系电话"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="company" className="form-label">
                      公司
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="请输入您的公司名称"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    留言内容 *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="form-textarea"
                    placeholder="请详细描述您的需求或问题..."
                  ></textarea>
                </div>

                <button type="submit" className="contact-submit-button">
                  <span>发送消息</span>
                  <svg className="button-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="contact-info-section">
              <h2 className="section-title">联系方式</h2>
              <div className="contact-info-list">
                <div className="contact-info-item">
                  <div className="apple-icon-wrapper gold">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="contact-info-content">
                    <h3 className="contact-info-title">公司地址</h3>
                    <p className="contact-info-description">
                      中国上海市浦东新区张江高科技园区<br />
                      邮编：201203
                    </p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="apple-icon-wrapper gold">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="contact-info-content">
                    <h3 className="contact-info-title">联系电话</h3>
                    <p className="contact-info-description">
                      总机：+86 21 5888 8888<br />
                      销售热线：+86 21 5888 8889<br />
                      技术支持：+86 21 5888 8890
                    </p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="apple-icon-wrapper gold">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="contact-info-content">
                    <h3 className="contact-info-title">电子邮箱</h3>
                    <p className="contact-info-description">
                      商务合作：business@unitedchem.com<br />
                      技术咨询：tech@unitedchem.com<br />
                      客户服务：service@unitedchem.com
                    </p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="apple-icon-wrapper gold">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="contact-info-content">
                    <h3 className="contact-info-title">工作时间</h3>
                    <p className="contact-info-description">
                      周一至周五：9:00 - 18:00<br />
                      周六：9:00 - 12:00<br />
                      节假日除外
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="contact-map-section">
        <div className="container">
          <div className={`contact-map-content ${isLoaded ? "loaded" : ""}`}>
            <h2 className="section-title">地理位置</h2>
            <div className="map-placeholder">
              <div className="map-icon">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="map-description">
                联合化工总部位于上海浦东张江高科技园区，交通便利，环境优美
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}