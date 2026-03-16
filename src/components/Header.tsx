"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { COMMUNITIES } from "@/lib/constants";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // Text / icon colors swap based on scroll position
  const textColor = scrolled ? "text-dark" : "text-white";
  const hoverColor = "hover:text-gold";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-[10px]">
            <Image
              src="/images/logo/perfecto-logo.svg"
              alt="Perfecto Homes"
              width={26}
              height={21}
              className="w-[26px] h-[21px]"
            />
            <span className={`text-[22px] font-semibold tracking-[0.06em] ${textColor} transition-colors`}>
              PERFECTO HOMES
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {/* Communities Dropdown */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1 text-[16px] font-normal font-[family-name:var(--font-manrope)] tracking-[0.02em] ${textColor} ${hoverColor} transition-colors`}
                onMouseEnter={() => setOpenDropdown("communities")}
              >
                Communities
                <ChevronDown />
              </button>
              <div
                className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2 min-w-[200px]">
                  <Link
                    href="/communities/communities"
                    className="block px-4 py-2 text-sm text-dark hover:bg-light-gray hover:text-gold transition-colors"
                  >
                    All Communities
                  </Link>
                  {COMMUNITIES.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/communities/${c.slug}`}
                      className="block px-4 py-2 text-sm text-dark hover:bg-light-gray hover:text-gold transition-colors"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Resources Dropdown */}
            <div className="relative group">
              <button className={`flex items-center gap-1 text-[16px] font-normal font-[family-name:var(--font-manrope)] tracking-[0.02em] ${textColor} ${hoverColor} transition-colors`}>
                Resources
                <ChevronDown />
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2 min-w-[200px]">
                  <Link
                    href="/blog"
                    className="block px-4 py-2 text-sm text-dark hover:bg-light-gray hover:text-gold transition-colors"
                  >
                    Blog
                  </Link>
                  <Link
                    href="/events"
                    className="block px-4 py-2 text-sm text-dark hover:bg-light-gray hover:text-gold transition-colors"
                  >
                    Events
                  </Link>
                </div>
              </div>
            </div>

            {/* About Us Dropdown */}
            <div className="relative group">
              <button className={`flex items-center gap-1 text-[16px] font-normal font-[family-name:var(--font-manrope)] tracking-[0.02em] ${textColor} ${hoverColor} transition-colors`}>
                About Us
                <ChevronDown />
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2 min-w-[200px]">
                  <Link
                    href="/About-Us/elisban-gonzales"
                    className="block px-4 py-2 text-sm text-dark hover:bg-light-gray hover:text-gold transition-colors"
                  >
                    Elisban Gonzales
                  </Link>
                  <Link
                    href="/About-Us/gina-gonzalez"
                    className="block px-4 py-2 text-sm text-dark hover:bg-light-gray hover:text-gold transition-colors"
                  >
                    Gina Gonzalez
                  </Link>
                  <Link
                    href="/About-Us/alfredo-gonzalez"
                    className="block px-4 py-2 text-sm text-dark hover:bg-light-gray hover:text-gold transition-colors"
                  >
                    Alfredo Gonzalez
                  </Link>
                  <Link
                    href="/About-Us/jamil-gonzales"
                    className="block px-4 py-2 text-sm text-dark hover:bg-light-gray hover:text-gold transition-colors"
                  >
                    Jamil Gonzales
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/Contact-Us"
              className="bg-[#fcfcfc] rounded-[10px] px-5 py-[14px] text-xs tracking-[0.16em] text-dark hover:bg-gray-100 transition-colors flex items-center gap-2"
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

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            <MobileDropdown title="Communities">
              <Link href="/communities/communities" className="block py-2 pl-4 text-sm text-gray-600 hover:text-gold" onClick={() => setMobileOpen(false)}>
                All Communities
              </Link>
              {COMMUNITIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/communities/${c.slug}`}
                  className="block py-2 pl-4 text-sm text-gray-600 hover:text-gold"
                  onClick={() => setMobileOpen(false)}
                >
                  {c.name}
                </Link>
              ))}
            </MobileDropdown>

            <MobileDropdown title="Resources">
              <Link href="/blog" className="block py-2 pl-4 text-sm text-gray-600 hover:text-gold" onClick={() => setMobileOpen(false)}>Blog</Link>
              <Link href="/events" className="block py-2 pl-4 text-sm text-gray-600 hover:text-gold" onClick={() => setMobileOpen(false)}>Events</Link>
            </MobileDropdown>

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
