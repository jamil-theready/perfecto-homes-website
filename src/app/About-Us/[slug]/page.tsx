import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { TEAM, PHONE } from "@/lib/constants";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return TEAM.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = TEAM.find((m) => m.slug === slug);
  if (!member) return {};
  return {
    title: `${member.name} - ${member.role}`,
    description: `Meet ${member.name}, ${member.role} at Perfecto Homes Real Estate. ${member.bio.substring(0, 150)}`,
  };
}

export default async function TeamMemberPage({ params }: Props) {
  const { slug } = await params;
  const member = TEAM.find((m) => m.slug === slug);
  if (!member) notFound();

  const hasFullBio = "fullBio" in member && Array.isArray((member as any).fullBio);
  const hasDre = "dre" in member;
  const hasBackground = "background" in member && Array.isArray((member as any).background);
  const hasListings = "listingsUrl" in member;
  const hasNotary = "notaryUrl" in member;
  const hasSocialLinks = "socialLinks" in member;

  const fullBio = hasFullBio ? (member as any).fullBio as string[] : [];
  const dre = hasDre ? (member as any).dre as { corp: string; individual: string } : null;
  const background = hasBackground ? (member as any).background as { title: string; year: string }[] : [];
  const listingsUrl = hasListings ? (member as any).listingsUrl as string : null;
  const notaryUrl = hasNotary ? (member as any).notaryUrl as string : null;
  const socialLinks = hasSocialLinks ? (member as any).socialLinks as { facebook?: string; instagram?: string } : null;

  return (
    <>
      {/* Hero */}
      <section className="bg-dark text-white pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/#team" className="text-gold text-sm hover:underline mb-4 inline-block">&larr; Back to Team</Link>
        </div>
      </section>

      {/* Profile */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Left Column: Photo + Contact Card */}
            <div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-200">
                <Image src={member.image} alt={member.name} fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>

              {/* Name & DRE under photo */}
              <div className="mt-6">
                <h2 className="text-xl font-serif font-bold text-dark">{member.name}</h2>
                {dre && (
                  <div className="flex gap-6 mt-1 text-xs text-medium-gray tracking-wide">
                    <span>CORP DRE {dre.corp}</span>
                    <span>DRE {dre.individual}</span>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="mt-4 space-y-2">
                <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-sm text-dark hover:text-gold transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  {member.phone}
                </a>
                <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-sm text-dark hover:text-gold transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  {member.email}
                </a>
              </div>

              {/* Listings Link */}
              {listingsUrl && (
                <a href={listingsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-4 text-sm font-semibold text-gold hover:text-gold-dark transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                  {member.name.split(" ")[0]}&apos;s Listings
                </a>
              )}

              {/* Notary Website Link */}
              {notaryUrl && (
                <a href={notaryUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-2 text-sm font-semibold text-gold hover:text-gold-dark transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                  Notary Services Website
                </a>
              )}

              {/* Social Icons */}
              {socialLinks && (
                <div className="flex gap-3 mt-4">
                  {socialLinks.facebook && (
                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-dark hover:border-gold hover:text-gold transition-colors" aria-label="Facebook">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-dark hover:border-gold hover:text-gold transition-colors" aria-label="Instagram">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Bio + Background */}
            <div className="md:col-span-2">
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-dark mb-2">Meet, {member.name}</h1>
              <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-6">{member.role}</p>

              {/* Bio */}
              {hasFullBio ? (
                <div className="space-y-4 mb-10">
                  <p className="text-medium-gray leading-relaxed">{member.bio}</p>
                  {fullBio.map((paragraph, i) => (
                    <p key={i} className="text-medium-gray leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="text-medium-gray leading-relaxed text-lg mb-10">{member.bio}</p>
              )}

              {/* Background Timeline */}
              {hasBackground && background.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold tracking-[0.3em] uppercase text-dark mb-6">Background</h3>
                  <div className="space-y-5">
                    {background.map((item, i) => (
                      <div key={i} className="border-l-2 border-gold/30 pl-4">
                        <p className="text-dark font-medium text-sm">{item.title}</p>
                        <p className="text-gold text-xs mt-0.5">{item.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/Contact-Us"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
                >
                  Contact {member.name.split(" ")[0]}
                </Link>
                {notaryUrl && (
                  <a
                    href={notaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-2 border-gold text-gold hover:bg-gold hover:text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
                  >
                    Notary Services
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Team Members */}
      <section className="bg-light-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif font-bold text-dark mb-8">Other Team Members</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TEAM.filter((m) => m.slug !== slug).map((m) => (
              <Link
                key={m.slug}
                href={`/About-Us/${m.slug}`}
                className="group flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-gold/20">
                  <Image src={m.image} alt={m.name} fill className="object-cover object-top" sizes="64px" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark text-sm group-hover:text-gold transition-colors">{m.name}</h3>
                  <p className="text-medium-gray text-xs">{m.role}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
