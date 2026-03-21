"use client";

const SITE_URL = "https://www.perfectohomesrealestate.com";

function ShareButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Share on ${label}`}
      className="w-9 h-9 rounded-full bg-light-gray hover:bg-gold hover:text-white text-medium-gray flex items-center justify-center transition-all duration-200"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </a>
  );
}

export default function ShareButtons({
  url,
  title,
  horizontal = false,
}: {
  url: string;
  title: string;
  horizontal?: boolean;
}) {
  const fullUrl = encodeURIComponent(`${SITE_URL}${url}`);
  const encodedTitle = encodeURIComponent(title);

  const buttons = (
    <>
      <ShareButton
        href={`https://www.facebook.com/sharer/sharer.php?u=${fullUrl}`}
        label="Facebook"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </ShareButton>
      <ShareButton
        href={`https://twitter.com/intent/tweet?url=${fullUrl}&text=${encodedTitle}`}
        label="X"
      >
        <path d="M4 4l11.733 16h4.267l-11.733-16z" />
        <path d="M4 20l6.768-6.768" />
        <path d="M20 4l-6.768 6.768" />
      </ShareButton>
      <ShareButton
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${fullUrl}&title=${encodedTitle}`}
        label="LinkedIn"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </ShareButton>
      <ShareButton
        href={`mailto:?subject=${encodedTitle}&body=Check out this article: ${SITE_URL}${url}`}
        label="Email"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </ShareButton>
    </>
  );

  if (horizontal) {
    return <div className="flex gap-2">{buttons}</div>;
  }

  return (
    <div className="sticky top-24 flex flex-col gap-2">
      {buttons}
    </div>
  );
}
