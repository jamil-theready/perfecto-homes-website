"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { COMMUNITIES, TEAM, PERU_LISTINGS, SOCIAL_LINKS } from "@/lib/constants";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeDropdown = useCallback(() => setOpenDropdown(null), []);

  return (
    <>
      {/* Dark overlay */}
      {openDropdown && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeDropdown}
        />
      )}

      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100"
        onMouseLeave={closeDropdown}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo — hidden when mobile menu is open */}
            <Link href="/" className={`group flex items-center gap-[10px] transition-opacity ${mobileOpen ? "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto" : ""}`} onClick={closeDropdown}>
              <Image
                src="/images/logo/perfecto-logo.svg"
                alt="Perfecto Homes"
                width={26}
                height={21}
                className="w-[26px] h-[21px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              />
              <span className="text-[18px] font-semibold tracking-[0.06em] text-dark transition-colors">
                PERFECTO HOMES
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              <NavButton
                label="Communities"
                isOpen={openDropdown === "communities"}
                onHover={() => setOpenDropdown("communities")}
              />
              <NavButton
                label="Listings"
                isOpen={openDropdown === "listings"}
                onHover={() => setOpenDropdown("listings")}
              />
              <NavButton
                label="Resources"
                isOpen={openDropdown === "resources"}
                onHover={() => setOpenDropdown("resources")}
              />
              <NavButton
                label="About Us"
                isOpen={openDropdown === "about"}
                onHover={() => setOpenDropdown("about")}
              />

              <Link
                href="/contact"
                className="rounded-[10px] px-5 py-[14px] text-[14px] font-medium font-[family-name:var(--font-lato)] tracking-[0.02em] transition-all duration-300 flex items-center gap-2 bg-gold text-white hover:bg-gold-dark"
                onMouseEnter={closeDropdown}
                onClick={closeDropdown}
              >
                Contact Us
                <span className="text-xs">&rarr;</span>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-6 flex flex-col gap-1.5">
                <span
                  className={`block h-0.5 transition-transform bg-dark ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
                />
                <span
                  className={`block h-0.5 transition-opacity bg-dark ${mobileOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block h-0.5 transition-transform bg-dark ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* ===== FULL-WIDTH DROPDOWN PANELS ===== */}
        {openDropdown && (
          <div className="hidden lg:block border-t border-gray-100 bg-white shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

              {/* Communities Panel */}
              {openDropdown === "communities" && (
                <div className="flex gap-6">
                  {/* Sacramento */}
                  <div className="flex gap-4">
                    <Link href="/communities" className="group/card relative rounded-xl overflow-hidden w-[180px] h-[140px] shrink-0 block" onClick={closeDropdown}>
                      <Image src="/images/hero/sacramento-bridge.jpg" alt="Tower Bridge over the Sacramento River, Sacramento California" fill className="object-cover transition-transform duration-500 group-hover/card:scale-110" sizes="180px" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-[13px] font-semibold">Sacramento</p>
                      </div>
                    </Link>
                    <div>
                      <p className="text-[10px] tracking-[0.16em] uppercase text-gray-400 font-semibold mb-2">Sacramento</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {COMMUNITIES.map((c) => (
                          <Link key={c.slug} href={`/communities/${c.slug}`} className="px-2 py-1.5 text-[13px] text-dark hover:text-gold transition-colors" onClick={closeDropdown}>
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="w-px bg-gray-100 shrink-0" />
                  {/* Peru */}
                  <div className="flex gap-4">
                    <Link href="/communities/peru" className="group/card relative rounded-xl overflow-hidden w-[180px] h-[140px] shrink-0 block" onClick={closeDropdown}>
                      <Image src="/images/peru/pisac.jpg" alt="Pisac ruins and terraces in the Sacred Valley, Peru" fill className="object-cover transition-transform duration-500 group-hover/card:scale-110" sizes="180px" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-[13px] font-semibold">Sacred Valley</p>
                      </div>
                    </Link>
                    <div>
                      <p className="text-[10px] tracking-[0.16em] uppercase text-gray-400 font-semibold mb-2">Sacred Valley</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <Link href="/communities/ollantaytambo" className="px-2 py-1.5 text-[13px] text-dark hover:text-gold transition-colors" onClick={closeDropdown}>Ollantaytambo</Link>
                        <Link href="/communities/urubamba" className="px-2 py-1.5 text-[13px] text-dark hover:text-gold transition-colors" onClick={closeDropdown}>Urubamba</Link>
                        <Link href="/communities/pisac" className="px-2 py-1.5 text-[13px] text-dark hover:text-gold transition-colors" onClick={closeDropdown}>Pisac</Link>
                        <Link href="/communities/chinchero" className="px-2 py-1.5 text-[13px] text-dark hover:text-gold transition-colors" onClick={closeDropdown}>Chinchero</Link>
                        <Link href="/communities/calca" className="px-2 py-1.5 text-[13px] text-dark hover:text-gold transition-colors" onClick={closeDropdown}>Calca</Link>
                        <Link href="/communities/yucay" className="px-2 py-1.5 text-[13px] text-dark hover:text-gold transition-colors" onClick={closeDropdown}>Yucay</Link>
                        <Link href="/communities/maras" className="px-2 py-1.5 text-[13px] text-dark hover:text-gold transition-colors" onClick={closeDropdown}>Maras</Link>
                        <Link href="/communities/aguas-calientes" className="px-2 py-1.5 text-[13px] text-dark hover:text-gold transition-colors" onClick={closeDropdown}>Aguas Calientes</Link>
                      </div>
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="w-px bg-gray-100 shrink-0" />
                  {/* Cusco City */}
                  <div className="flex gap-4">
                    <Link href="/communities/cusco" className="group/card relative rounded-xl overflow-hidden w-[180px] h-[140px] shrink-0 block" onClick={closeDropdown}>
                      <Image src="/images/peru/cusco.jpg" alt="Cusco city rooftops and historic center, Peru" fill className="object-cover transition-transform duration-500 group-hover/card:scale-110" sizes="180px" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-[13px] font-semibold">Cusco City</p>
                      </div>
                    </Link>
                    <div>
                      <p className="text-[10px] tracking-[0.16em] uppercase text-gray-400 font-semibold mb-2">Cusco City</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <Link href="/communities/cusco" className="px-2 py-1.5 text-[13px] text-dark hover:text-gold transition-colors" onClick={closeDropdown}>Cusco</Link>
                        <Link href="/communities/centro-historico" className="px-2 py-1.5 text-[13px] text-dark hover:text-gold transition-colors" onClick={closeDropdown}>Centro Histórico</Link>
                        <Link href="/communities/san-blas" className="px-2 py-1.5 text-[13px] text-dark hover:text-gold transition-colors" onClick={closeDropdown}>San Blas</Link>
                        <Link href="/communities/wanchaq" className="px-2 py-1.5 text-[13px] text-dark hover:text-gold transition-colors" onClick={closeDropdown}>Wanchaq</Link>
                        <Link href="/communities/san-sebastian" className="px-2 py-1.5 text-[13px] text-dark hover:text-gold transition-colors" onClick={closeDropdown}>San Sebastián</Link>
                        <Link href="/communities/san-jeronimo" className="px-2 py-1.5 text-[13px] text-dark hover:text-gold transition-colors" onClick={closeDropdown}>San Jerónimo</Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Listings Panel */}
              {openDropdown === "listings" && (
                <div className="flex gap-8">
                  {/* Sacramento */}
                  <div>
                    <p className="text-[10px] tracking-[0.16em] uppercase text-gray-400 font-semibold mb-3">Sacramento</p>
                    <div className="grid grid-cols-3 gap-3 w-[480px]">
                      {[
                        { name: "11610 Vickie Dr", slug: "11610-vickie-dr", img: "https://res.cloudinary.com/duwsn5ksy/image/upload/w_400,q_auto,f_auto/listings/perfecto-homes/11610-vickie-dr/1" },
                        { name: "6630 Dunmore Ave", slug: "6630-dunmore-ave", img: "https://res.cloudinary.com/duwsn5ksy/image/upload/w_400,q_auto,f_auto/listings/perfecto-homes/6630-dunmore-ave/1" },
                        { name: "6236 Riverbelle Ct", slug: "6236-riverbelle-ct", img: "https://res.cloudinary.com/duwsn5ksy/image/upload/w_400,q_auto,f_auto/listings/perfecto-homes/6236-riverbelle-ct/1" },
                      ].map((l) => (
                        <Link key={l.slug} href={`/listings/${l.slug}`} className="group/card block" onClick={closeDropdown}>
                          <div className="relative rounded-lg overflow-hidden aspect-[4/3] mb-2">
                            <Image src={l.img} alt={l.name} fill className="object-cover transition-transform duration-500 group-hover/card:scale-110" sizes="160px" unoptimized />
                          </div>
                          <p className="text-[12px] font-medium text-dark group-hover/card:text-gold transition-colors leading-tight">{l.name}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="w-px bg-gray-100 shrink-0" />
                  {/* Peru */}
                  <div>
                    <p className="text-[10px] tracking-[0.16em] uppercase text-gray-400 font-semibold mb-3">Peru</p>
                    <div className="grid grid-cols-3 gap-3 w-[480px]">
                      {PERU_LISTINGS.map((l) => (
                        <Link key={l.slug} href={`/peru/${l.slug}`} className="group/card block" onClick={closeDropdown}>
                          <div className="relative rounded-lg overflow-hidden aspect-[4/3] mb-2">
                            <Image src={l.image} alt={l.name} fill className="object-cover transition-transform duration-500 group-hover/card:scale-110" sizes="160px" />
                          </div>
                          <p className="text-[12px] font-medium text-dark group-hover/card:text-gold transition-colors leading-tight">{l.name}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Resources Panel */}
              {openDropdown === "resources" && (
                <div className="flex gap-6">
                  <Link href="/blog" className="group/card flex items-center gap-4 bg-light-gray rounded-xl p-4 hover:bg-gray-100 transition-colors w-[200px]" onClick={closeDropdown}>
                    <div>
                      <p className="text-[14px] font-semibold text-dark group-hover/card:text-gold transition-colors">Blog</p>
                      <p className="text-xs text-medium-gray">Articles and guides</p>
                    </div>
                  </Link>
                  <Link href="/events" className="group/card flex items-center gap-4 bg-light-gray rounded-xl p-4 hover:bg-gray-100 transition-colors w-[200px]" onClick={closeDropdown}>
                    <div>
                      <p className="text-[14px] font-semibold text-dark group-hover/card:text-gold transition-colors">Events</p>
                      <p className="text-xs text-medium-gray">Upcoming events</p>
                    </div>
                  </Link>
                  <Link href="/blog/first-time-home-buyer-guide-sacramento-ca" className="group/card flex items-center gap-4 bg-light-gray rounded-xl p-4 hover:bg-gray-100 transition-colors w-[200px]" onClick={closeDropdown}>
                    <div>
                      <p className="text-[14px] font-semibold text-dark group-hover/card:text-gold transition-colors">Buyer Guide</p>
                      <p className="text-xs text-medium-gray">First-time buyers</p>
                    </div>
                  </Link>
                  <Link href="/blog/selling-your-home-in-sacramento-what-to-expect" className="group/card flex items-center gap-4 bg-light-gray rounded-xl p-4 hover:bg-gray-100 transition-colors w-[200px]" onClick={closeDropdown}>
                    <div>
                      <p className="text-[14px] font-semibold text-dark group-hover/card:text-gold transition-colors">Seller Guide</p>
                      <p className="text-xs text-medium-gray">Selling your home</p>
                    </div>
                  </Link>
                  <Link href="/webinar" className="group/card flex items-center gap-4 bg-light-gray rounded-xl p-4 hover:bg-gray-100 transition-colors w-[200px]" onClick={closeDropdown}>
                    <div>
                      <p className="text-[14px] font-semibold text-dark group-hover/card:text-gold transition-colors">Free Webinar</p>
                      <p className="text-xs text-medium-gray">Learn to buy a home</p>
                    </div>
                  </Link>
                </div>
              )}

              {/* About Us Panel */}
              {openDropdown === "about" && (
                <div>
                  <Link href="/about/elisban-gonzales" className="text-[13px] text-gold font-semibold hover:underline mb-4 inline-block" onClick={closeDropdown}>About Perfecto Homes &rarr;</Link>
                  <div className="grid grid-cols-4 gap-4">
                    {TEAM.map((m) => (
                      <Link
                        key={m.slug}
                        href={`/about/${m.slug}`}
                        className="group/card flex items-center gap-4 rounded-xl p-4 hover:bg-light-gray transition-colors"
                        onClick={closeDropdown}
                      >
                        <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border border-gold/20" style={{ background: "linear-gradient(135deg, #f5ecd7 0%, #e8d5a0 100%)" }}>
                          <Image
                            src={m.image}
                            alt={m.name}
                            fill
                            className="object-cover object-top"
                            sizes="56px"
                          />
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-dark group-hover/card:text-gold transition-colors">{m.name}</p>
                          <p className="text-xs text-medium-gray">{m.role}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </header>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[85%] max-w-[360px] bg-white shadow-2xl lg:hidden flex flex-col transform transition-transform duration-300 ease-out ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-end px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <button onClick={() => setMobileOpen(false)} className="text-dark p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Panel Content — scrollable middle */}
        <div className="flex-1 overflow-y-auto px-6 pt-5 pb-8 space-y-1">
          {/* Listings — with image cards (first) */}
          <MobileSection title="Listings">
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/listings"
                className="group/card relative block rounded-xl overflow-hidden h-[100px]"
                onClick={() => setMobileOpen(false)}
              >
                <Image
                  src="/images/hero/sacramento-bridge.jpg"
                  alt="Homes for sale in the Sacramento area"
                  fill
                  className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                  sizes="150px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-[12px] font-semibold">Sacramento</p>
                </div>
              </Link>
              <Link
                href="/peru"
                className="group/card relative block rounded-xl overflow-hidden h-[100px]"
                onClick={() => setMobileOpen(false)}
              >
                <Image
                  src="/images/hero/peru-landscape.jpg"
                  alt="Property for sale in Cusco and the Sacred Valley, Peru"
                  fill
                  className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                  sizes="150px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-[12px] font-semibold">Peru</p>
                </div>
              </Link>
            </div>
          </MobileSection>

          {/* About Us — with agent photos */}
          <MobileSection title="About Us" href="/about/elisban-gonzales">
            <div className="space-y-1 pt-1">
              {TEAM.map((m) => (
                <Link
                  key={m.slug}
                  href={`/about/${m.slug}`}
                  className="flex items-center gap-3 py-2 pl-2 rounded-lg hover:bg-light-gray transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-gold/20" style={{ background: "linear-gradient(135deg, #f5ecd7 0%, #e8d5a0 100%)" }}>
                    <Image src={m.image} alt={m.name} fill className="object-cover object-top" sizes="44px" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-dark">{m.name}</p>
                    <p className="text-[11px] text-medium-gray">{m.role}</p>
                  </div>
                </Link>
              ))}
            </div>
          </MobileSection>

          {/* Sacramento Communities */}
          <MobileDropdown title="Sacramento Communities">
            {COMMUNITIES.map((c) => (
              <Link key={c.slug} href={`/communities/${c.slug}`} className="block py-2 pl-4 text-[14px] text-dark hover:text-gold" onClick={() => setMobileOpen(false)}>
                {c.name}
              </Link>
            ))}
          </MobileDropdown>

          {/* Sacred Valley */}
          <MobileDropdown title="Sacred Valley">
            <Link href="/communities/ollantaytambo" className="block py-2 pl-4 text-[14px] text-dark hover:text-gold" onClick={() => setMobileOpen(false)}>Ollantaytambo</Link>
            <Link href="/communities/urubamba" className="block py-2 pl-4 text-[14px] text-dark hover:text-gold" onClick={() => setMobileOpen(false)}>Urubamba</Link>
            <Link href="/communities/pisac" className="block py-2 pl-4 text-[14px] text-dark hover:text-gold" onClick={() => setMobileOpen(false)}>Pisac</Link>
            <Link href="/communities/chinchero" className="block py-2 pl-4 text-[14px] text-dark hover:text-gold" onClick={() => setMobileOpen(false)}>Chinchero</Link>
            <Link href="/communities/calca" className="block py-2 pl-4 text-[14px] text-dark hover:text-gold" onClick={() => setMobileOpen(false)}>Calca</Link>
            <Link href="/communities/yucay" className="block py-2 pl-4 text-[14px] text-dark hover:text-gold" onClick={() => setMobileOpen(false)}>Yucay</Link>
            <Link href="/communities/maras" className="block py-2 pl-4 text-[14px] text-dark hover:text-gold" onClick={() => setMobileOpen(false)}>Maras</Link>
            <Link href="/communities/aguas-calientes" className="block py-2 pl-4 text-[14px] text-dark hover:text-gold" onClick={() => setMobileOpen(false)}>Aguas Calientes</Link>
          </MobileDropdown>

          {/* Cusco City */}
          <MobileDropdown title="Cusco City">
            <Link href="/communities/cusco" className="block py-2 pl-4 text-[14px] text-dark hover:text-gold" onClick={() => setMobileOpen(false)}>Cusco</Link>
            <Link href="/communities/centro-historico" className="block py-2 pl-4 text-[14px] text-dark hover:text-gold" onClick={() => setMobileOpen(false)}>Centro Histórico</Link>
            <Link href="/communities/san-blas" className="block py-2 pl-4 text-[14px] text-dark hover:text-gold" onClick={() => setMobileOpen(false)}>San Blas</Link>
            <Link href="/communities/wanchaq" className="block py-2 pl-4 text-[14px] text-dark hover:text-gold" onClick={() => setMobileOpen(false)}>Wanchaq</Link>
            <Link href="/communities/san-sebastian" className="block py-2 pl-4 text-[14px] text-dark hover:text-gold" onClick={() => setMobileOpen(false)}>San Sebastián</Link>
            <Link href="/communities/san-jeronimo" className="block py-2 pl-4 text-[14px] text-dark hover:text-gold" onClick={() => setMobileOpen(false)}>San Jerónimo</Link>
          </MobileDropdown>

          <Link href="/blog" className="block py-2 text-[15px] font-semibold text-dark hover:text-gold" onClick={() => setMobileOpen(false)}>Blog</Link>
          <Link href="/webinar" className="block py-2 text-[15px] font-semibold text-dark hover:text-gold" onClick={() => setMobileOpen(false)}>Free Webinar</Link>
        </div>

        {/* Panel Footer — fixed at bottom */}
        <div className="flex-shrink-0 px-6 pt-5 pb-8 border-t border-gray-100 space-y-3">
          <Link
            href="/contact"
            className="block text-center bg-gold text-white rounded-lg px-5 py-3.5 text-sm font-semibold hover:bg-gold-dark transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Contact Us
          </Link>
          <a
            href="tel:+19168787260"
            className="flex items-center justify-center gap-2 text-sm font-medium text-dark hover:text-gold border border-gray-200 rounded-lg py-3 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            (916) 878-7260
          </a>
          <div className="flex items-center justify-between pt-2">
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-light-gray text-medium-gray hover:bg-gold hover:text-white transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-light-gray text-medium-gray hover:bg-gold hover:text-white transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-light-gray text-medium-gray hover:bg-gold hover:text-white transition-colors" aria-label="TikTok">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            </a>
            <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-light-gray text-medium-gray hover:bg-gold hover:text-white transition-colors" aria-label="YouTube">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function NavButton({
  label,
  isOpen,
  onHover,
}: {
  label: string;
  isOpen: boolean;
  onHover: () => void;
}) {
  return (
    <button
      className={`flex items-center gap-1 text-[14px] font-medium font-[family-name:var(--font-lato)] tracking-[0.02em] text-dark hover:text-gold transition-colors ${isOpen ? "!text-gold" : ""}`}
      onMouseEnter={onHover}
    >
      {label}
      <ChevronDown />
    </button>
  );
}

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mt-0.5">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MobileSection({ title, children, href }: { title: string; children: React.ReactNode; href?: string }) {
  return (
    <div>
      {href ? (
        <Link href={href} className="block py-2 text-[15px] font-semibold text-dark hover:text-gold transition-colors">
          {title}
        </Link>
      ) : (
        <p className="py-2 text-[15px] font-semibold text-dark">{title}</p>
      )}
      <div className="pb-2">{children}</div>
    </div>
  );
}

function MobileDropdown({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        className="flex items-center justify-between w-full py-2 text-[15px] font-semibold text-dark hover:text-gold transition-colors text-left"
        onClick={() => setOpen(!open)}
      >
        {title}
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="pb-2">{children}</div>}
    </div>
  );
}
