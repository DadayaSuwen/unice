"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import "./login.scss";

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("admin@unicechemical.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("请填写邮箱和密码");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_user", JSON.stringify(data.user));
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "登录失败");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container flex items-center justify-center p-4">
      {/* 左侧装饰区域 */}
      <div className="login-decoration"></div>

      {/* 登录卡片 */}
      <div className="login-card">
        {/* 品牌标识 */}
        <div className="login-brand">
          <div className="brand-icon">
            <Shield className="shield-icon" />
          </div>
          <h1 className="brand-title">管理员登录</h1>
          <p className="brand-subtitle">江西联合化学管理后台</p>
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              邮箱地址
            </label>
            <div className="form-input-wrapper">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="admin@unicechemical.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              密码
            </label>
            <div className="form-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "隐藏密码" : "显示密码"}
              >
                {showPassword ? (
                  <EyeOff />
                ) : (
                  <Eye />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="submit-button"
          >
            <div className="button-content">
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  <span>登录中...</span>
                </>
              ) : (
                <span>立即登录</span>
              )}
            </div>
          </button>
        </form>

        {/* 返回前台 */}
        <div className="back-link">
          <Link href="/" className="back-link-item">
            <ArrowLeft />
            返回前台网站
          </Link>
        </div>
      </div>
    </div>
  );
}