"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "提交失败");
      }
      alert("感谢您的留言！我们会尽快回复您。");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "提交失败，请稍后重试");
    }
  };

  return (
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
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </button>
    </form>
  );
}
