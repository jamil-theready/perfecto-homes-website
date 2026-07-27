import { Metadata } from "next";
import Link from "next/link";
import { getCollection } from "@/lib/content";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming real estate events, open houses, and community workshops from Perfecto Homes Real Estate in Sacramento.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  const events = getCollection("events");

  return (
    <>
      <section className="bg-dark text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">Upcoming</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold">Events</h1>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Join us at open houses, workshops, and community events across Sacramento.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {events.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-medium-gray text-lg mb-6">No upcoming events at this time.</p>
              <p className="text-medium-gray mb-8">Check back soon or follow us on social media for updates.</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
              >
                Contact Us
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {events.map((event) => (
                <div
                  key={event.slug}
                  className="bg-light-gray rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6"
                >
                  {/* Date Block */}
                  {event.date && (
                    <div className="shrink-0 text-center">
                      <div className="w-16 h-16 bg-gold rounded-xl flex flex-col items-center justify-center text-white">
                        <span className="text-xs font-semibold uppercase">
                          {new Date(event.date as string).toLocaleDateString("en-US", { month: "short" })}
                        </span>
                        <span className="text-xl font-bold leading-none">
                          {new Date(event.date as string).getDate()}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-dark mb-2">{event.title as string}</h2>
                    {event.location && (
                      <p className="text-medium-gray text-sm mb-1">📍 {event.location as string}</p>
                    )}
                    {event.time && (
                      <p className="text-medium-gray text-sm mb-3">🕐 {event.time as string}</p>
                    )}
                    {event.excerpt && (
                      <p className="text-medium-gray text-sm leading-relaxed">{event.excerpt as string}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
