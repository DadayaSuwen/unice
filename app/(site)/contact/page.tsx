import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import {
  getContactPage,
  getPageHeaders,
  getSiteSettings,
  seoToMetadata,
} from "@/lib/globals";

const FALLBACK_META = {
  title: "联系我们 - 江西联合化工",
  description: "期待与您的合作与交流，我们将竭诚为您提供专业的化工产品解决方案",
};

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const headers = await getPageHeaders();
  return seoToMetadata((headers as any).seo || {}, FALLBACK_META);
}

export default async function ContactPage() {
  const [contactPage, headers, settings] = await Promise.all([
    getContactPage(),
    getPageHeaders(),
    getSiteSettings(),
  ]);
  const hero = headers.contactPage;
  const c = settings.contact;

  return (
    <div className="app-wrapper">
      {/* Hero Section */}
      <section className="hero-section-contact">
        <div className="container-small">
          <div className="hero-content-contact loaded">
            <h1 className="page-title">{hero.title}</h1>
            <p className="page-subtitle">{hero.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-main-section">
        <div className="container">
          <div className="contact-content loaded">
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2 className="section-title">{contactPage.formTitle}</h2>
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div className="contact-info-section">
              <h2 className="section-title">{contactPage.infoTitle}</h2>
              <div className="contact-info-list">
                <div className="contact-info-item">
                  <div className="apple-icon-wrapper gold">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="contact-info-content">
                    <h3 className="contact-info-title">公司地址</h3>
                    <p className="contact-info-description">
                      {c.address}
                      <br />
                      {c.addressLine2}
                      <br />
                      邮编：{c.zipCode}
                    </p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="apple-icon-wrapper gold">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div className="contact-info-content">
                    <h3 className="contact-info-title">联系电话</h3>
                    <p className="contact-info-description">
                      电话：{c.phone}
                      <br />
                      传真：{c.fax}
                      <br />
                      技术支持：{c.techPhone}
                    </p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="apple-icon-wrapper gold">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="contact-info-content">
                    <h3 className="contact-info-title">电子邮箱</h3>
                    <p className="contact-info-description">
                      商务合作：{c.email}
                      <br />
                      技术咨询：{c.email}
                      <br />
                      客户服务：{c.email}
                    </p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="apple-icon-wrapper gold">
                    <svg
                      className="w-6 h-6"
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
                  <div className="contact-info-content">
                    <h3 className="contact-info-title">工作时间</h3>
                    <p className="contact-info-description">
                      周一至周五：9:00 - 18:00
                      <br />
                      周六：9:00 - 12:00
                      <br />
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
          <div className="contact-map-content loaded">
            <h2 className="section-title">{contactPage.mapTitle}</h2>
            <div className="map-placeholder">
              <div className="map-icon">
                <svg
                  className="w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p className="map-description">{contactPage.mapDescription}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
