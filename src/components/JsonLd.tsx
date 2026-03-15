export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Perfecto Homes Real Estate",
    url: "https://www.perfectohomesrealestate.com",
    telephone: "+19168787703",
    email: "elisban.gonzales@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sacramento",
      addressRegion: "CA",
      addressCountry: "US",
    },
    sameAs: [
      "https://www.facebook.com/PerfectoHomesRealEstate",
      "https://www.instagram.com/perfectohomesrealestate",
      "https://www.tiktok.com/@perfectohomesrealestate",
      "https://www.youtube.com/@PerfectoHomesRealEstate",
    ],
    areaServed: [
      { "@type": "City", name: "Sacramento" },
      { "@type": "City", name: "Citrus Heights" },
      { "@type": "City", name: "Roseville" },
      { "@type": "City", name: "Folsom" },
      { "@type": "City", name: "Elk Grove" },
      { "@type": "City", name: "El Dorado Hills" },
      { "@type": "City", name: "Rancho Cordova" },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
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
}: {
  title: string;
  date?: string;
  description: string;
  url: string;
  image?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    url: `https://www.perfectohomesrealestate.com${url}`,
    description,
    ...(date && { datePublished: date }),
    ...(image && { image }),
    author: {
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
