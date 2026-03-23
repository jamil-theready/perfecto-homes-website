"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { COMMUNITIES, TEAM } from "@/lib/constants";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeDropdown = useCallback(() => setOpenDropdown(null), []);

  const textColor = scrolled ? "text-dark" : "text-white";
  const hoverColor = "hover:text-gold";

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
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled || openDropdown
            ? "bg-white/95 backdrop-blur-sm border-b border-gray-100"
            : "bg-transparent"
        }`}
        onMouseLeave={closeDropdown}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-[10px]" onClick={closeDropdown}>
              <Image
                src="/images/logo/perfecto-logo.svg"
                alt="Perfecto Homes"
                width={26}
                height={21}
                className="w-[26px] h-[21px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              />
              <span className={`text-[22px] font-semibold tracking-[0.06em] ${openDropdown ? "text-dark" : textColor} transition-colors`}>
                PERFECTO HOMES
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              <NavButton
                label="Communities"
                isOpen={openDropdown === "communities"}
                onHover={() => setOpenDropdown("communities")}
                textColor={openDropdown ? "text-dark" : textColor}
                hoverColor={hoverColor}
              />
              <Link
                href="/listings"
                className={`text-[14px] font-medium font-[family-name:var(--font-manrope)] tracking-[0.02em] transition-colors ${
                  openDropdown ? "text-dark hover:text-gold" : `${textColor} ${hoverColor}`
                }`}
                onMouseEnter={closeDropdown}
              >
                Properties
              </Link>
              <Link
                href="/blog"
                className={`text-[14px] font-medium font-[family-name:var(--font-manrope)] tracking-[0.02em] transition-colors ${
                  openDropdown ? "text-dark hover:text-gold" : `${textColor} ${hoverColor}`
                }`}
                onMouseEnter={closeDropdown}
              >
                Blog
              </Link>
              <NavButton
                label="About Us"
                isOpen={openDropdown === "about"}
                onHover={() => setOpenDropdown("about")}
                textColor={openDropdown ? "text-dark" : textColor}
                hoverColor={hoverColor}
              />

              <Link
                href="/Contact-Us"
                className={`rounded-[10px] px-5 py-[14px] text-[14px] font-medium font-[family-name:var(--font-manrope)] tracking-[0.02em] transition-all duration-300 flex items-center gap-2 ${
                  scrolled || openDropdown
                    ? "bg-gold text-white hover:bg-gold-dark"
                    : "bg-white/15 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-dark"
                }`}
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
                  className={`block h-0.5 transition-transform ${scrolled ? "bg-dark" : "bg-white"} ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
                />
                <span
                  className={`block h-0.5 transition-opacity ${scrolled ? "bg-dark" : "bg-white"} ${mobileOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block h-0.5 transition-transform ${scrolled ? "bg-dark" : "bg-white"} ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* ===== FULL-WIDTH DROPDOWN PANELS ===== */}
        {openDropdown && (
          <div className="hidden lg:block border-t border-gray-100 bg-white shadow-xl">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

              {/* Communities Panel */}
              {openDropdown === "communities" && (
                <div className="flex gap-8">
                  {/* Image cards */}
                  <div className="flex gap-4 shrink-0">
                    <Link
                      href="/communities/communities"
                      className="group/card relative rounded-xl overflow-hidden w-[240px] h-[160px] block"
                      onClick={closeDropdown}
                    >
                      <Image
                        src="/images/hero/sacramento-bridge.jpg"
                        alt="Sacramento"
                        fill
                        className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                        sizes="240px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white text-[15px] font-semibold">Sacramento Area</p>
                        <p className="text-white/70 text-xs mt-0.5">Explore 9 communities &rarr;</p>
                      </div>
                    </Link>
                    <Link
                      href="/#peru"
                      className="group/card relative rounded-xl overflow-hidden w-[240px] h-[160px] block"
                      onClick={closeDropdown}
                    >
                      <Image
                        src="/images/hero/peru-landscape.jpg"
                        alt="Sacred Valley, Peru"
                        fill
                        className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                        sizes="240px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white text-[15px] font-semibold">Sacred Valley, Peru</p>
                        <p className="text-white/70 text-xs mt-0.5">View 3 properties &rarr;</p>
                      </div>
                    </Link>
                  </div>

                  {/* Community links */}
                  <div className="flex-1 pl-4 border-l border-gray-100">
                    <p className="text-[10px] tracking-[0.16em] uppercase text-gray-400 font-semibold mb-3">Sacramento Communities</p>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-1">
                      {COMMUNITIES.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/communities/${c.slug}`}
                          className="px-3 py-2 text-[13px] text-dark hover:text-gold rounded-lg hover:bg-light-gray transition-colors"
                          onClick={closeDropdown}
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* About Us Panel */}
              {openDropdown === "about" && (
                <div className="grid grid-cols-4 gap-4">
                  {TEAM.map((m) => (
                    <Link
                      key={m.slug}
                      href={`/About-Us/${m.slug}`}
                      className="group/card flex items-center gap-4 bg-light-gray rounded-xl p-4 hover:bg-gray-100 transition-colors"
                      onClick={closeDropdown}
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-200">
                        <Image
                          src={m.image}
                          alt={m.name}
                          fill
                          className="object-cover"
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
              )}

            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              <MobileDropdown title="Communities">
                <Link href="/communities/communities" className="block py-2 pl-4 text-sm font-medium text-dark hover:text-gold" onClick={() => setMobileOpen(false)}>
                  Sacramento Area
                </Link>
                {COMMUNITIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/communities/${c.slug}`}
                    className="block py-2 pl-6 text-sm text-gray-600 hover:text-gold"
                    onClick={() => setMobileOpen(false)}
                  >
                    {c.name}
                  </Link>
                ))}
                <Link href="/#peru" className="block py-2 pl-4 text-sm font-medium text-dark hover:text-gold mt-1" onClick={() => setMobileOpen(false)}>
                  Sacred Valley, Peru
                </Link>
              </MobileDropdown>

              <Link href="/listings" className="block py-3 text-base font-semibold text-dark hover:text-gold" onClick={() => setMobileOpen(false)}>Properties</Link>

              <Link href="/blog" className="block py-3 text-base font-semibold text-dark hover:text-gold" onClick={() => setMobileOpen(false)}>Blog</Link>

              <MobileDropdown title="About Us">
                <Link href="/About-Us/elisban-gonzales" className="block py-2 pl-4 text-sm text-gray-600 hover:text-gold" onClick={() => setMobileOpen(false)}>Elisban Gonzales</Link>
                <Link href="/About-Us/gina-gonzalez" className="block py-2 pl-4 text-sm text-gray-600 hover:text-gold" onClick={() => setMobileOpen(false)}>Gina Gonzalez</Link>
                <Link href="/About-Us/alfredo-gonzalez" className="block py-2 pl-4 text-sm text-gray-600 hover:text-gold" onClick={() => setMobileOpen(false)}>Alfredo Gonzalez</Link>
                <Link href="/About-Us/jamil-gonzales" className="block py-2 pl-4 text-sm text-gray-600 hover:text-gold" onClick={() => setMobileOpen(false)}>Jamil Gonzales</Link>
              </MobileDropdown>

              <Link
                href="/Contact-Us"
                className="block text-center bg-[#fcfcfc] rounded-[10px] px-5 py-3.5 text-xs text-dark hover:bg-gray-100 transition-colors mt-4"
                onClick={() => setMobileOpen(false)}
              >
                Contact Us &rarr;
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

function NavButton({
  label,
  isOpen,
  onHover,
  textColor,
  hoverColor,
}: {
  label: string;
  isOpen: boolean;
  onHover: () => void;
  textColor: string;
  hoverColor: string;
}) {
  return (
    <button
      className={`flex items-center gap-1 text-[14px] font-medium font-[family-name:var(--font-manrope)] tracking-[0.02em] ${textColor} ${hoverColor} transition-colors ${isOpen ? "!text-gold" : ""}`}
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

function MobileDropdown({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        className="flex items-center justify-between w-full py-2 text-sm font-medium text-dark"
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
