import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
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
            {/* Photo */}
            <div>
              <div
                className="aspect-[3/4] rounded-2xl bg-gray-200 bg-cover bg-top"
                style={{ backgroundImage: `url('${member.image}')` }}
              />
            </div>

            {/* Info */}
            <div className="md:col-span-2">
              <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-2">{member.role}</p>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-dark mb-6">{member.name}</h1>
              <p className="text-medium-gray leading-relaxed text-lg mb-8">{member.bio}</p>

              {/* Contact Details */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  </div>
                  <a href={`tel:${member.phone}`} className="text-dark font-medium hover:text-gold transition-colors">{member.phone}</a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  </div>
                  <a href={`mailto:${member.email}`} className="text-dark font-medium hover:text-gold transition-colors">{member.email}</a>
                </div>
              </div>

              <Link
                href="/Contact-Us"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
              >
                Contact {member.name.split(" ")[0]}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Other Team Members */}
      <section className="bg-light-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif font-bold text-dark mb-8">Other Team Members</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM.filter((m) => m.slug !== slug).map((m) => (
              <Link
                key={m.slug}
                href={`/About-Us/${m.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div
                  className="aspect-[4/3] bg-gray-200 bg-cover bg-top"
                  style={{ backgroundImage: `url('${m.image}')` }}
                />
                <div className="p-5 flex flex-col">
                  <h3 className="font-semibold text-dark">{m.name}</h3>
                  <p className="text-gold text-sm mb-3">{m.role}</p><span className="text-sm font-semibold text-dark group-hover:text-gold transition-colors">View Profile &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
