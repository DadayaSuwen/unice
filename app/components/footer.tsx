"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Users,
  Award,
  Shield,
} from "lucide-react";

export default function Footer() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [productLinks, setProductLinks] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // 从数据库获取产品数据
  useEffect(() => {
    async function fetchProducts() {
      try {
        setProductsLoading(true);
        const response = await fetch("/api/products?featured=true&limit=4");
        if (response.ok) {
          const data = await response.json();
          const products = data.products || data; // 处理不同的数据结构
          const formattedProducts = (products || [])
            .slice(0, 4)
            .map((product: any) => ({
              href: `/products/${product.id}`,
              title: product.name,
              description: product.description
                ? product.description.length > 30
                  ? product.description.substring(0, 30) + "..."
                  : product.description
                : "高性能化工产品",
            }));
          setProductLinks(formattedProducts);
        } else {
          // API请求失败，使用默认数据
          setProductLinks([
            {
              href: "/products",
              title: "丙烯酸树脂",
              description: "高性能树脂材料",
            },
            { href: "/products", title: "PP树脂", description: "聚丙烯树脂" },
            {
              href: "/products",
              title: "触变型树脂",
              description: "特种功能树脂",
            },
            {
              href: "/products",
              title: "水分散体",
              description: "环保型水分散体",
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        // 如果获取失败，使用默认数据
        setProductLinks([
          {
            href: "/products",
            title: "丙烯酸树脂",
            description: "高性能树脂材料",
          },
          { href: "/products", title: "PP树脂", description: "聚丙烯树脂" },
          {
            href: "/products",
            title: "触变型树脂",
            description: "特种功能树脂",
          },
          {
            href: "/products",
            title: "水分散体",
            description: "环保型水分散体",
          },
        ]);
      } finally {
        setProductsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const companyLinks = [
    { href: "/about", title: "公司简介", icon: Building },
    { href: "/about", title: "企业文化", icon: Users },
    { href: "/careers", title: "加入我们", icon: Award },
    { href: "/contact", title: "联系我们", icon: Mail },
  ];

  const legalLinks = [
    { href: "#", title: "隐私政策" },
    { href: "#", title: "服务条款" },
    { href: "#", title: "网站地图" },
    { href: "#", title: "法律声明" },
  ];

  return (
    <footer className="apple-footer">
      {/* Background decoration */}
      <div className="apple-footer__bg-decoration" />
      <div className="apple-footer__bg-decoration-secondary" />

      <div className="container mx-auto px-6 py-20">
        {/* Main Footer Content */}
        <div className={`apple-footer__main ${isLoaded ? "loaded" : ""}`}>
          {/* Company Info */}
          <div className="apple-footer__section">
            <Link href="/" className="apple-footer__logo-link">
              <div className="apple-footer__logo">
                <Image
                  src="/logo.jpg"
                  alt="江西联合化工"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="apple-footer__brand">
                <h3 className="apple-footer__brand-name">江西联合化工</h3>
                <p className="apple-footer__brand-tagline">专业树脂制造商</p>
              </div>
            </Link>

            <p className="apple-footer__description">
              成立于2002年，专注化工树脂研发生产20余年，年产值达8亿元人民币，为全球客户提供高品质的化工产品解决方案。
            </p>

            <div className="apple-footer__quality-mark">
              <span className="apple-footer__quality-text">ISO 9001</span>
              <span className="apple-footer__quality-desc">质量认证企业</span>
            </div>
          </div>

          {/* Products */}
          <div className="apple-footer__section">
            <h4 className="apple-footer__section-title">核心产品</h4>
            <ul className="apple-footer__link-list">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="apple-footer__product-link">
                    <ChevronRight className="apple-footer__link-icon" />
                    <div className="apple-footer__product-content">
                      <p className="apple-footer__product-title">
                        {link.title}
                      </p>
                      <p className="apple-footer__product-desc">
                        {link.description}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="apple-footer__section">
            <h4 className="apple-footer__section-title">关于我们</h4>
            <ul className="apple-footer__link-list">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="apple-footer__company-link">
                    <link.icon className="apple-footer__link-icon" />
                    <span className="apple-footer__link-text">
                      {link.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="apple-footer__section">
            <h4 className="apple-footer__section-title">联系方式</h4>
            <div className="apple-footer__contact-list">
              <div className="apple-footer__contact-item">
                <div className="apple-footer__contact-icon-wrapper">
                  <MapPin className="apple-footer__contact-icon" />
                </div>
                <div className="apple-footer__contact-content">
                  <p className="apple-footer__contact-label">公司地址</p>
                  <p className="apple-footer__contact-text">
                    江西省九江市永修县艾城镇
                    <br />
                    星火工业园荣祺大道16号
                  </p>
                </div>
              </div>

              <div className="apple-footer__contact-item">
                <div className="apple-footer__contact-icon-wrapper">
                  <Phone className="apple-footer__contact-icon" />
                </div>
                <div className="apple-footer__contact-content">
                  <p className="apple-footer__contact-label">联系电话</p>
                  <p className="apple-footer__contact-text">18162108792</p>
                  <p className="apple-footer__contact-text">
                    传真：0792-3053111
                  </p>
                </div>
              </div>

              <div className="apple-footer__contact-item">
                <div className="apple-footer__contact-icon-wrapper">
                  <Mail className="apple-footer__contact-icon" />
                </div>
                <div className="apple-footer__contact-content">
                  <p className="apple-footer__contact-label">电子邮箱</p>
                  <p className="apple-footer__contact-text">
                    1179002658@qq.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="apple-footer__bottom">
          <div className="apple-footer__bottom-content">
            {/* Copyright */}
            <div className="apple-footer__copyright">
              <p className="apple-footer__copyright-text">
                © {new Date().getFullYear()} 江西联合化学有限公司. 保留所有权利.
              </p>
              <p className="apple-footer__copyright-tagline">
                专业 · 创新 · 品质 · 服务
              </p>
              <p className="apple-footer__icp-number">
                赣ICP备2020014627号-2
              </p>
            </div>

            {/* Legal Links */}
            <div className="apple-footer__legal-links">
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="apple-footer__legal-link"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Icon components
const Building = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
);
