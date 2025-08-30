import React from "react";

// In a real app, this component would be imported from a shared components directory.
// It's included here to make this example runnable.
const Trans: React.FC<{ translationKey: string; text: string }> = ({ text }) => {
  return <>{text}</>;
};

// Data for the component's lists, structured for easier translation management.
const benefits = [
  { key: "benefit1", text: "Avg. 18 min arrival in metros" },
  { key: "benefit2", text: "10,000+ successful rescues" },
  { key: "benefit3", text: "Background‑verified partners" },
  { key: "benefit4", text: "Live status & secure payments" },
];

const services = [
  { key: "service1", text: "Flat‑tyre" },
  { key: "service2", text: "Jumpstart" },
  { key: "service3", text: "Fuel delivery" },
  { key: "service4", text: "Key unlock" },
  { key: "service5", text: "Towing" },
  { key: "service6", text: "Minor repairs" },
];

/**
 * The left-side hero panel for the signup page, showcasing the app's benefits.
 */
export default function SignupHero(): React.ReactElement {
  return (
    <aside
      aria-label="RoadGuard benefits"
      className="relative hidden h-full overflow-hidden rounded-2xl bg-gray-800 text-white lg:flex"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-8 top-10 h-56 w-56 rounded-full border border-zinc-800/80" />
        <div className="absolute left-28 top-36 h-64 w-64 rounded-full border border-zinc-900/70" />
        <div className="absolute -right-12 bottom-10 h-72 w-72 rounded-full border border-zinc-800/80" />
      </div>
      <div className="relative z-10 flex h-full flex-col gap-6 p-10">
        <span className="inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-wide text-amber-400">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2l2.4 5 5.3.8-3.8 3.7.9 5.3L12 14.9 7.2 16.8l.9-5.3L4.3 7.8 9.6 7l2.4-5z"
            />
          </svg>
          <Trans
            translationKey="signup.hero.reimagined"
            text="Roadside assistance, reimagined"
          />
        </span>
        <h2 className="text-pretty text-4xl font-bold leading-tight md:text-5xl">
          <Trans
            translationKey="signup.hero.title"
            text="Get help on the road in minutes"
          />
        </h2>
        <p className="max-w-md text-zinc-300">
          <Trans
            translationKey="signup.hero.description"
            text="Join RoadGuard to connect with nearby mechanics, towing and fuel delivery. Live tracking, transparent pricing, and 24/7 coverage keep you moving."
          />
        </p>
        <ul className="mt-2 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          {benefits.map((item) => (
            <li key={item.key} className="flex items-start gap-2">
              <svg
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-zinc-200">
                <Trans translationKey={`signup.hero.${item.key}`} text={item.text} />
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex flex-wrap gap-2 text-[13px] text-zinc-200">
          {services.map((service) => (
            <span key={service.key} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <Trans translationKey={`signup.hero.${service.key}`} text={service.text} />
            </span>
          ))}
        </div>
        <blockquote className="mt-auto rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-zinc-200">
            <Trans
              translationKey="signup.hero.quote"
              text="“Booked in seconds and help arrived in under half an hour. Absolute lifesaver.”"
            />
          </p>
          <footer className="mt-2 text-xs text-zinc-400">
            <Trans
              translationKey="signup.hero.quoteAuthor"
              text="A commuter in Bengaluru"
            />
          </footer>
        </blockquote>
      </div>
    </aside>
  );
}
