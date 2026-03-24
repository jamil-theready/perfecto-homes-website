import Image from "next/image";
import Link from "next/link";

type TeamCTAProps = {
  variant: "jamil" | "gina" | "alfredo";
};

const TEAM_CTA_DATA = {
  jamil: {
    name: "Jamil Gonzales",
    slug: "jamil-gonzales",
    title: "Need a Website That Works?",
    service: "The Ready Consult",
    description:
      "Websites, SEO, and digital marketing that drive real results. From design to deployment, we build systems that bring in leads while you focus on your business.",
    cta: "Get a Free Consultation",
    phone: "(916) 218-0751",
    image: "/images/team/jamil.png",
    accent: "#635bff",
    accentLight: "#f5f3ff",
  },
  gina: {
    name: "Gina Gonzalez",
    slug: "gina-gonzalez",
    title: "Need a Notary?",
    service: "Gina Gonzalez Notary",
    description:
      "Certified Notary Public and Loan Signing Agent serving Sacramento and surrounding areas. Mobile notary services, apostille, real estate closings, and more. Bilingual (English/Spanish).",
    cta: "Schedule a Signing",
    phone: "(415) 948-9967",
    image: "/images/team/gina.png",
    accent: "#C4A94D",
    accentLight: "#faf5e6",
  },
  alfredo: {
    name: "Alfredo Gonzalez",
    slug: "alfredo-gonzalez",
    title: "Need Financing?",
    service: "Commercial Capital",
    description:
      "Loan Officer specializing in first time buyer programs, second homes, and financing solutions regardless of immigration status. Let Alfredo find your pathway to homeownership.",
    cta: "Explore Your Options",
    phone: "(916) 878-7260",
    image: "/images/team/alfredo.png",
    accent: "#0e6245",
    accentLight: "#ecfdf5",
  },
};

export default function TeamCTA({ variant }: TeamCTAProps) {
  const data = TEAM_CTA_DATA[variant];

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: data.accentLight }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            {/* Image */}
            <div className="lg:col-span-2 relative aspect-[4/3] lg:aspect-auto">
              <Image
                src={data.image}
                alt={`${data.name} - ${data.service}`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>

            {/* Content */}
            <div className="lg:col-span-3 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
              <p
                className="text-xs font-semibold tracking-[0.2em] uppercase mb-3"
                style={{ color: data.accent }}
              >
                {data.service}
              </p>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-dark mb-4">
                {data.title}
              </h3>
              <p className="text-medium-gray leading-relaxed mb-8 max-w-lg">
                {data.description}
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href={`/About-Us/${data.slug}`}
                  className="inline-flex items-center gap-2 font-semibold text-white px-6 py-3 rounded-lg transition-opacity hover:opacity-90"
                  style={{ background: data.accent }}
                >
                  {data.cta}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
                <a
                  href={`tel:${data.phone}`}
                  className="text-sm font-medium transition-colors hover:underline"
                  style={{ color: data.accent }}
                >
                  Call {data.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
