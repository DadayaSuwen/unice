"use client";

import {
  MapPin,
  Phone,
  Mail,
  Beaker,
  Microscope,
  TestTube,
  Target,
  Building,
  Palette,
  TrendingUp,
  Rocket,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--footer-bg-primary) 0%, var(--footer-bg-secondary) 50%, var(--footer-bg-primary) 100%)",
      }}
    >
      {/* 背景装饰 */}
      <div
        className="absolute inset-0"
        style={{
          background: "var(--gold-gradient-subtle)",
        }}
      ></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--footer-gold)_0%,transparent_60%)]"></div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(212, 175, 55, 0.08) 0%, transparent 40%)",
        }}
      ></div>
      <div
        className="absolute inset-0 bg-gradient-to-t to-transparent"
        style={{
          background:
            "linear-gradient(to top, var(--footer-border), transparent)",
        }}
      ></div>

      <div className="relative container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 公司信息 */}
          <div className="space-y-6 footer-section">
            <div className="flex items-center space-x-4 group gap-6">
              <div className="relative w-12 h-12 bg-gradient-to-br from-primary-gold to-amber-600 rounded-2xl overflow-hidden shadow-xl group-hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors"></div>
                <Image
                  src="/logo.jpg"
                  alt="联合化工"
                  width={48}
                  height={48}
                  className="object-contain p-1.5 relative z-10"
                />
              </div>
              <div>
                <h3
                  className="text-xl font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--footer-text-primary) 0%, var(--primary-gold-bright) 50%, var(--footer-text-primary) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  联合化工
                </h3>
                <p
                  className="text-xs mt-0.5"
                  style={{
                    color: "var(--footer-text-muted)",
                  }}
                >
                  创新化学科技
                </p>
              </div>
            </div>
            <p
              className="leading-relaxed text-sm transition-colors duration-300"
              style={{
                color: "var(--footer-text-secondary)",
              }}
            >
              专业的化工企业，致力于为客户提供高质量的产品和创新解决方案。
            </p>
          </div>

          {/* 快速链接 */}
          <div className="space-y-6 footer-section">
            <h4
              className="font-bold text-lg"
              style={{
                background:
                  "linear-gradient(135deg, var(--footer-text-primary) 0%, var(--primary-gold) 50%, var(--footer-text-primary) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              产品服务
            </h4>
            <ul className="space-y-4">
              {[
                { href: "/products", text: "化工原料", icon: Beaker },
                {
                  href: "/products",
                  text: "精细化学品",
                  icon: Microscope,
                },
                { href: "/products", text: "专用化学品", icon: TestTube },
                { href: "/products", text: "定制解决方案", icon: Target },
              ].map((item, index) => (
                <li key={index} className="group/link">
                  <Link
                    href={item.href}
                    className="flex items-center space-x-3 text-gray-400 hover:text-white transition-all duration-300 group-hover/link:translate-x-1 transform"
                  >
                    <item.icon
                      className="w-5 h-5 transition-colors duration-300 transform group-hover/link:rotate-12"
                      style={{
                        color: "var(--footer-text-secondary)",
                      }}
                      strokeWidth={2}
                    />
                    <span
                      className="relative"
                      style={{
                        color: "var(--footer-text-secondary)",
                      }}
                    >
                      {item.text}
                      <span
                        className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300"
                        style={{
                          background: "var(--gold-gradient-strong)",
                        }}
                      ></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 关于我们 */}
          <div className="space-y-6 footer-section">
            <h4
              className="font-bold text-lg"
              style={{
                background:
                  "linear-gradient(135deg, var(--footer-text-primary) 0%, var(--primary-gold) 50%, var(--footer-text-primary) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              关于
            </h4>
            <ul className="space-y-4">
              {[
                { href: "/about", text: "公司简介", icon: Building },
                { href: "/about", text: "企业文化", icon: Palette },
                { href: "/about", text: "发展历程", icon: TrendingUp },
                { href: "/careers", text: "加入我们", icon: Rocket },
              ].map((item, index) => (
                <li key={index} className="group/link">
                  <Link
                    href={item.href}
                    className="flex items-center space-x-3 text-gray-400 hover:text-white transition-all duration-300 group-hover/link:translate-x-1 transform"
                  >
                    <item.icon
                      className="w-5 h-5 transition-colors duration-300 transform group-hover/link:rotate-12"
                      style={{
                        color: "var(--footer-text-secondary)",
                      }}
                      strokeWidth={2}
                    />
                    <span
                      className="relative"
                      style={{
                        color: "var(--footer-text-secondary)",
                      }}
                    >
                      {item.text}
                      <span
                        className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300"
                        style={{
                          background: "var(--gold-gradient-strong)",
                        }}
                      ></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 联系信息 */}
          <div className="space-y-6 footer-section">
            <h4
              className="font-bold text-lg"
              style={{
                background:
                  "linear-gradient(135deg, var(--footer-text-primary) 0%, var(--primary-gold) 50%, var(--footer-text-primary) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              联系方式
            </h4>
            <div className="space-y-4 flex flex-col gap-2">
              <div
                className="group/contact flex items-start space-x-4 p-3 rounded-xl transition-all duration-300 cursor-pointer"
                style={{
                  background: "var(--footer-bg-accent)",
                  border: "1px solid var(--footer-border)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 mt-0.5"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--primary-gold/20), var(--primary-gold/10))",
                  }}
                >
                  <MapPin
                    className="w-5 h-5 transition-colors"
                    style={{
                      color: "var(--primary-gold)",
                    }}
                    strokeWidth={2}
                  />
                </div>
                <div className="space-y-1">
                  <p
                    className="font-medium"
                    style={{
                      color: "var(--footer-text-primary)",
                    }}
                  >
                    办公地址
                  </p>
                  <p
                    className="text-sm transition-colors"
                    style={{
                      color: "var(--footer-text-secondary)",
                    }}
                  >
                    北京市朝阳区化工路123号
                  </p>
                </div>
              </div>

              <div
                className="group/contact flex items-start space-x-4 p-3 rounded-xl transition-all duration-300 cursor-pointer"
                style={{
                  background: "var(--footer-bg-accent)",
                  border: "1px solid var(--footer-border)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 mt-0.5"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--primary-gold/20), var(--primary-gold/10))",
                  }}
                >
                  <Phone
                    className="w-5 h-5 transition-colors"
                    style={{
                      color: "var(--primary-gold)",
                    }}
                    strokeWidth={2}
                  />
                </div>
                <div className="space-y-1">
                  <p
                    className="font-medium"
                    style={{
                      color: "var(--footer-text-primary)",
                    }}
                  >
                    联系电话
                  </p>
                  <p
                    className="text-sm transition-colors"
                    style={{
                      color: "var(--footer-text-secondary)",
                    }}
                  >
                    010-12345678
                  </p>
                </div>
              </div>

              <div
                className="group/contact flex items-start space-x-4 p-3 rounded-xl transition-all duration-300 cursor-pointer"
                style={{
                  background: "var(--footer-bg-accent)",
                  border: "1px solid var(--footer-border)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 mt-0.5"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--primary-gold/20), var(--primary-gold/10))",
                  }}
                >
                  <Mail
                    className="w-5 h-5 transition-colors"
                    style={{
                      color: "var(--primary-gold)",
                    }}
                    strokeWidth={2}
                  />
                </div>
                <div className="space-y-1">
                  <p
                    className="font-medium"
                    style={{
                      color: "var(--footer-text-primary)",
                    }}
                  >
                    电子邮箱
                  </p>
                  <p
                    className="text-sm transition-colors"
                    style={{
                      color: "var(--footer-text-secondary)",
                    }}
                  >
                    info@unicechemical.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 版权信息 */}
        <div
          className="mt-16 pt-8"
          style={{
            borderTop: "1px solid var(--footer-border)",
          }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-center lg:text-left">
              <p
                className="text-sm flex items-center space-x-2"
                style={{
                  color: "var(--footer-text-secondary)",
                }}
              >
                <span>© {new Date().getFullYear()} 联合化工</span>
                <span style={{ color: "var(--primary-gold)" }}>•</span>
                <span>保留所有权利</span>
              </p>
              <div className="flex items-center space-x-1">
                <span style={{ color: "var(--primary-gold)" }}>♥</span>
                <span
                  className="text-xs"
                  style={{
                    color: "var(--footer-text-muted)",
                  }}
                >
                  用心服务每一个客户
                </span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-end items-center gap-6 text-sm">
              {[
                { href: "#", text: "隐私政策" },
                { href: "#", text: "服务条款" },
                { href: "#", text: "网站地图" },
                { href: "#", text: "法律声明" },
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="relative group hover:scale-105 transition-all duration-300"
                  style={{
                    color: "var(--footer-text-secondary)",
                  }}
                >
                  {item.text}
                  <span
                    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300"
                    style={{
                      background: "var(--gold-gradient-strong)",
                    }}
                  ></span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
