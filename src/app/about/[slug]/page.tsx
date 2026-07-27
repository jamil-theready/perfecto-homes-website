import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { TEAM, PHONE } from "@/lib/constants";
import { getCollection } from "@/lib/content";
import { PersonJsonLd } from "@/components/JsonLd";

type Props = { params: Promise<{ slug: string }> };

// Titles get " | Perfecto Homes Real Estate" appended by the root template, so keep
// the page-side role short enough to stay inside Google's ~60 char display limit.
function shortRole(role: string): string {
  const base = role.split("|")[0].trim();
  return base === "Real Estate Specialist" ? "Realtor" : base;
}

// Meta descriptions must land in the 80-155 range; truncate the bio on a word boundary.
function metaDescription(name: string, role: string, bio: string): string {
  const prefix = `Meet ${name}, ${shortRole(role)} at Perfecto Homes Real Estate. `;
  const room = 155 - prefix.length;
  if (room < 20) return prefix.trim();
  if (bio.length <= room) return prefix + bio;
  const cut = bio.slice(0, room);
  return prefix + cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:]$/, "") + ".";
}


export async function generateStaticParams() {
  return TEAM.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = TEAM.find((m) => m.slug === slug);
  if (!member) return {};
  return {
    title: `${member.name}, ${shortRole(member.role)}`,
    description: metaDescription(member.name, member.role, member.bio),
    alternates: { canonical: `/about/${slug}` },
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
  const hasPeruListings = "peruListings" in member && (member as any).peruListings === true;

  // Get listings for this team member
  const agentSlug = member.slug.split("-")[0]; // "elisban", "gina", etc.
  const sacramentoListings = getCollection("listings/sacramento").filter(
    (l) => l.agent === agentSlug
  );
  const peruListings = hasPeruListings ? getCollection("peru") : [];

  const fullBio = hasFullBio ? (member as any).fullBio as string[] : [];
  const dre = hasDre ? (member as any).dre as { corp: string; individual: string } : null;
  const background = hasBackground ? (member as any).background as { title: string; year: string }[] : [];
  const listingsUrl = hasListings ? (member as any).listingsUrl as string : null;
  const notaryUrl = hasNotary ? (member as any).notaryUrl as string : null;
  const socialLinks = hasSocialLinks ? (member as any).socialLinks as { facebook?: string; instagram?: string } : null;

  return (
    <>
      <PersonJsonLd
        name={member.name}
        role={member.role}
        slug={member.slug}
        image={member.image}
        email={member.email}
        telephone={member.phone}
        description={member.bio}
        sameAs={socialLinks ? Object.values(socialLinks).filter(Boolean) as string[] : undefined}
      />
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
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-dark mb-2">Meet, {member.name}</h1>
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
                  href="/contact"
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

      {/* Listings Section */}
      {(sacramentoListings.length > 0 || peruListings.length > 0) && (
        <section className="bg-light-gray py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-serif font-bold text-dark mb-2">
              {hasPeruListings ? "Peru Listings" : `${member.name.split(" ")[0]}'s Listings`}
            </h2>
            <p className="text-medium-gray text-sm mb-8">
              {hasPeruListings
                ? "Investment properties in Peru's Sacred Valley"
                : "Current and recent properties"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sacramentoListings.map((listing) => (
                <Link
                  key={listing.slug}
                  href={`/listings/${listing.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={listing.featuredImage || listing.image1}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {listing.status && (
                      <span className="absolute top-3 left-3 bg-gold text-white text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full">
                        {listing.status}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-dark text-sm group-hover:text-gold transition-colors">{listing.title}</p>
                    <p className="text-medium-gray text-xs mt-1">{listing.city}, {listing.state} {listing.zip}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-gold font-bold text-sm">{listing.price}</span>
                      {listing.beds && (
                        <span className="text-xs text-medium-gray">{listing.beds} bd / {listing.baths} ba</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              {peruListings.map((listing) => (
                <Link
                  key={listing.slug}
                  href={`/peru/${listing.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={listing.image1}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {listing.listingStatus && (
                      <span className="absolute top-3 left-3 bg-gold text-white text-[10px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full">
                        {listing.listingStatus}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-dark text-sm group-hover:text-gold transition-colors">{listing.title}</p>
                    <p className="text-medium-gray text-xs mt-1">{listing.city}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-gold font-bold text-sm">{listing.price}</span>
                      {listing.propertyType && (
                        <span className="text-xs text-medium-gray">{listing.propertyType}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Notary Services Section — Gina only */}
      {notaryUrl && (
        <section className="bg-white py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">Professional Notary Services</p>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-dark mb-4">Gina Gonzalez Notary Public</h2>
              <p className="text-medium-gray max-w-2xl mx-auto leading-relaxed">
                NNA Certified Notary Public with 10+ years of experience and a legal background. Mobile notary services available 7 days a week across the Greater Sacramento Area. Bilingual in English and Spanish.
              </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
              <div className="bg-light-gray rounded-xl p-5 text-center">
                <p className="text-xl font-bold text-gold">6,000+</p>
                <p className="text-xs text-medium-gray mt-1">Documents Notarized</p>
              </div>
              <div className="bg-light-gray rounded-xl p-5 text-center">
                <p className="text-xl font-bold text-gold">10+</p>
                <p className="text-xs text-medium-gray mt-1">Years Experience</p>
              </div>
              <div className="bg-light-gray rounded-xl p-5 text-center">
                <p className="text-xl font-bold text-gold">100%</p>
                <p className="text-xs text-medium-gray mt-1">Client Satisfaction</p>
              </div>
              <div className="bg-light-gray rounded-xl p-5 text-center">
                <p className="text-xl font-bold text-gold">7 Days</p>
                <p className="text-xs text-medium-gray mt-1">A Week Availability</p>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <h3 className="font-semibold text-dark text-sm mb-2">Legal & Personal Documents</h3>
                <p className="text-medium-gray text-xs leading-relaxed">Powers of attorney, prenuptial agreements, name changes, affidavits, and court proceedings.</p>
              </div>
              <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <h3 className="font-semibold text-dark text-sm mb-2">Real Estate & Loan Signings</h3>
                <p className="text-medium-gray text-xs leading-relaxed">Deeds, refinancing, property transfers, loan signings, and all real estate closing documents.</p>
              </div>
              <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </div>
                <h3 className="font-semibold text-dark text-sm mb-2">Apostille Services</h3>
                <p className="text-medium-gray text-xs leading-relaxed">International document authentication and document translation services for global use.</p>
              </div>
              <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
                <h3 className="font-semibold text-dark text-sm mb-2">Wedding Officiant</h3>
                <p className="text-medium-gray text-xs leading-relaxed">Certified wedding officiant offering customized ceremonies. Make your special day official and memorable.</p>
              </div>
              <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                </div>
                <h3 className="font-semibold text-dark text-sm mb-2">Mobile Notary</h3>
                <p className="text-medium-gray text-xs leading-relaxed">We come to you. Same-day service available across Sacramento, Roseville, Folsom, Elk Grove, and surrounding areas.</p>
              </div>
              <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <h3 className="font-semibold text-dark text-sm mb-2">DMV & Miscellaneous</h3>
                <p className="text-medium-gray text-xs leading-relaxed">DMV paperwork, travel consent forms, lease agreements, and any other documents requiring notarization.</p>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-light-gray rounded-2xl p-8 sm:p-10 mb-12">
              <h3 className="text-xl font-serif font-bold text-dark mb-8 text-center">How It Works</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gold text-white flex items-center justify-center text-lg font-bold mx-auto mb-4">1</div>
                  <h4 className="font-semibold text-dark text-sm mb-2">Schedule</h4>
                  <p className="text-medium-gray text-xs leading-relaxed">Contact Gina by phone, email, or through the website to book your appointment.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gold text-white flex items-center justify-center text-lg font-bold mx-auto mb-4">2</div>
                  <h4 className="font-semibold text-dark text-sm mb-2">Prepare</h4>
                  <p className="text-medium-gray text-xs leading-relaxed">Gather your documents and have a valid government-issued ID ready.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gold text-white flex items-center justify-center text-lg font-bold mx-auto mb-4">3</div>
                  <h4 className="font-semibold text-dark text-sm mb-2">Complete</h4>
                  <p className="text-medium-gray text-xs leading-relaxed">Meet at your preferred location for fast, professional notarization.</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-medium-gray text-sm mb-4">Available 7:00 AM to 9:00 PM, seven days a week</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={notaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
                >
                  Visit Notary Website
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
                <a
                  href="tel:+14159489967"
                  className="inline-flex items-center gap-2 border-2 border-gold text-gold hover:bg-gold hover:text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
                >
                  Call (415) 948-9967
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other Team Members */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-serif font-bold text-dark mb-8">Other Team Members</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TEAM.filter((m) => m.slug !== slug).map((m) => (
              <Link
                key={m.slug}
                href={`/about/${m.slug}`}
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
