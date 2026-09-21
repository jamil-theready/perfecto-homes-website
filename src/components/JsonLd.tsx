export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Perfecto Homes Real Estate",
    url: "https://www.perfectohomesrealestate.com",
    telephone: "+19168787260",
    email: "perfectohomes@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cusco",
      addressRegion: "Cusco",
      addressCountry: "PE",
    },
    sameAs: [
      "https://www.facebook.com/perfectohomes",
      "https://www.instagram.com/perfectohomes/",
      "https://www.tiktok.com/@perfectohomes",
      "https://www.youtube.com/@perfectohomes",
    ],
    knowsAbout: [
      "Cusco real estate",
      "property for sale Sacred Valley",
      "bilingual real estate agent",
      "Peru investment properties",
      "Sacred Valley real estate",
      "buying property in Peru as a foreigner",
    ],
    areaServed: [
      { "@type": "City", name: "Cusco" },
      { "@type": "City", name: "Ollantaytambo" },
      { "@type": "City", name: "Urubamba" },
      { "@type": "City", name: "Pisac" },
      { "@type": "City", name: "Chinchero" },
      { "@type": "City", name: "Calca" },
      { "@type": "Country", name: "Peru" },
    ],
  };

  const orgData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Perfecto Homes Real Estate",
    url: "https://www.perfectohomesrealestate.com",
    logo: "https://www.perfectohomesrealestate.com/images/logo/perfecto-logo-full.png",
    email: "perfectohomes@gmail.com",
    telephone: "+19168787260",
    sameAs: [
      "https://www.facebook.com/perfectohomes",
      "https://www.instagram.com/perfectohomes/",
      "https://www.tiktok.com/@perfectohomes",
      "https://www.youtube.com/@perfectohomes",
    ],
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Perfecto Homes Real Estate",
    alternateName: "Perfecto Homes",
    url: "https://www.perfectohomesrealestate.com",
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "Perfecto Homes Real Estate",
      url: "https://www.perfectohomesrealestate.com",
      logo: "https://www.perfectohomesrealestate.com/images/logo/perfecto-logo-full.png",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
    </>
  );
}

export function PropertyJsonLd({
  title,
  price,
  location,
  description,
  image,
  url,
}: {
  title: string;
  price: string;
  location: string;
  description: string;
  image?: string;
  url: string;
}) {
  const numericPrice = price.replace(/[^0-9.]/g, "");

  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: title,
    url: `https://www.perfectohomesrealestate.com${url}`,
    description,
    ...(image && { image }),
    offers: {
      "@type": "Offer",
      price: numericPrice,
      priceCurrency: "USD",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: location,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BlogPostJsonLd({
  title,
  date,
  description,
  url,
  image,
  authorName,
  authorSlug,
}: {
  title: string;
  date?: string;
  description: string;
  url: string;
  image?: string;
  authorName?: string;
  authorSlug?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    url: `https://www.perfectohomesrealestate.com${url}`,
    description,
    ...(date && { datePublished: date }),
    ...(image && { image }),
    author: authorName
      ? {
          "@type": "Person",
          name: authorName,
          ...(authorSlug && {
            url: `https://www.perfectohomesrealestate.com/about/${authorSlug}`,
          }),
        }
      : {
          "@type": "Organization",
          name: "Perfecto Homes Real Estate",
        },
    publisher: {
      "@type": "Organization",
      name: "Perfecto Homes Real Estate",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function PersonJsonLd({
  name,
  role,
  slug,
  image,
  email,
  telephone,
  description,
  sameAs,
}: {
  name: string;
  role: string;
  slug: string;
  image?: string;
  email?: string;
  telephone?: string;
  description?: string;
  sameAs?: string[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: role,
    url: `https://www.perfectohomesrealestate.com/about/${slug}`,
    ...(image && { image: `https://www.perfectohomesrealestate.com${image}` }),
    ...(email && { email }),
    ...(telephone && { telephone }),
    ...(description && { description }),
    ...(sameAs && sameAs.length > 0 && { sameAs }),
    worksFor: {
      "@type": "RealEstateAgent",
      name: "Perfecto Homes Real Estate",
      url: "https://www.perfectohomesrealestate.com",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
