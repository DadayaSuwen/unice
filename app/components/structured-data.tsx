interface ProductStructuredDataProps {
  products: Array<{
    id: number;
    name: string;
    cas_no?: string;
    description?: string;
    category?: {
      name: string;
    };
  }>;
}

export function ProductStructuredData({ products }: ProductStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "江西联合化工热门产品",
    description: "精选化工原料、精细化学品和专用化学品",
    url: "https://unice.com",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "Product",
      position: index + 1,
      name: product.name,
      description: product.description || "高品质化工产品",
      category: product.category?.name || "化工产品",
      identifier: product.cas_no,
      brand: {
        "@type": "Brand",
        name: "江西联合化工"
      },
      manufacturer: {
        "@type": "Organization",
        name: "江西联合化工",
        url: "https://unice.com"
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}

export function OrganizationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "江西联合化工",
    url: "https://unice.com",
    logo: "https://unice.com/uniche.png",
    description: "专业的化工企业，致力于提供高品质的化工原料、精细化学品和专用化学品",
    address: {
      "@type": "PostalAddress",
      addressCountry: "CN",
      addressRegion: "江西省"
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Chinese"
    },
    sameAs: [
      // 可以添加社交媒体链接
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}

export function WebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "江西联合化工官方网站",
    url: "https://unice.com",
    description: "江西联合化工 - 专业化工原料与精细化学品制造商",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://unice.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}