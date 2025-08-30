import type { ReactNode } from "react"
import { Bolt, MapPin, Sparkles } from "lucide-react"
import HeroAnimated from "../components/heroanimated"
import LocationPanel from "../components/locationpanel"
import Button from "../components/button"

// Feature Card Component
function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: ReactNode }) {
  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900 p-5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
      <div aria-hidden className="text-2xl mb-3">
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
    </div>
  )
}

// Audience Card Component
function AudienceCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border bg-white dark:bg-gray-900 p-5">
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
    </div>
  )
}

// Step Card Component
function StepCard({ step, title, desc }: { step: string; title: string; desc: string }) {
  return (
    <li className="rounded-lg border bg-white dark:bg-gray-900 p-5">
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-semibold">
          {step}
        </span>
        <h5 className="font-semibold">{title}</h5>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
    </li>
  )
}

// Main HomePage Component
export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Header / Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div className="text-center md:text-left space-y-6">
            <h1 className="text-balance text-4xl md:text-5xl font-bold tracking-tight">
              RoadGuard — Smart, location‑aware roadside assistance
            </h1>
            <p className="text-pretty text-gray-600 dark:text-gray-400 max-w-2xl mx-auto md:mx-0 text-lg md:text-xl leading-relaxed">
              Connect stranded drivers with nearby mechanics and towing services in real time. Reduce response times,
              improve communication, and stay safe — even in remote or hazardous areas.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:justify-start justify-center pt-2">
              <Button className="px-6 py-5 text-base">
                Get Help Now
              </Button>
              <Button variant="outline" className="px-6 py-5 text-base">
                Become a Provider
              </Button>
            </div>
          </div>

          {/* Animated visual */}
          <div className="order-first md:order-none">
            <HeroAnimated />
          </div>
        </div>
      </section>

      {/* Key Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <FeatureCard
            title="Real‑time assistance"
            desc="Request help 24/7 and get matched to the nearest available workshop or tow."
            icon={<Bolt className="h-6 w-6 text-blue-600" aria-hidden />}
          />
          <FeatureCard
            title="Find nearby mechanics"
            desc="List, card, and map views with distance filters and sorting by rating."
            icon={<MapPin className="h-6 w-6 text-blue-600" aria-hidden />}
          />
          <FeatureCard
            title="AI‑powered matching"
            desc="Smart suggestions and quick quotations to speed up your decision."
            icon={<Sparkles className="h-6 w-6 text-blue-600" aria-hidden />}
          />
        </div>
      </section>

      {/* Problem → Solution Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold">What problem are we solving?</h2>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-2">
              <li>Lack of real‑time roadside service and slow response.</li>
              <li>Difficulty locating trusted nearby mechanics and towing.</li>
              <li>No predictive guidance to pick the right provider quickly.</li>
              <li>No simple DIY guides for minor issues on the go.</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-semibold">Our solution</h3>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-2">
              <li>Live map and distance filters to discover nearby workshops.</li>
              <li>AI suggestions and fast quotations from providers.</li>
              <li>Role‑based flows for Admins, Providers, and Vehicle Owners.</li>
              <li>Notifications via in‑app and SMS/WhatsApp for every step.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <AudienceCard
            title="Drivers & Travelers"
            desc="Request help, track status, and view ETA with live location."
          />
          <AudienceCard
            title="Workshop Owners"
            desc="Showcase services, manage requests, and receive ratings & reviews."
          />
          <AudienceCard
            title="Mechanics & Workers"
            desc="See assigned tasks on calendar, log stages, and complete jobs."
          />
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-lg border bg-white dark:bg-gray-900 p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-semibold mb-4">How it works</h3>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <StepCard
              step="1"
              title="Submit request"
              desc="Log in, fill details (vehicle, service type, photos, location), then submit."
            />
            <StepCard
              step="2"
              title="Assignment"
              desc="Admins or auto‑matching assign a provider and notify both parties."
            />
            <StepCard
              step="3"
              title="Completion"
              desc="Mechanic updates stages; you track progress and review on completion."
            />
          </ol>
        </div>
      </section>

      {/* Map + Location context */}
      <section id="nearby" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl md:text-2xl font-semibold">Help near you</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Live location helps us find the best nearby provider</p>
        </div>

        <LocationPanel />
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-lg border bg-white dark:bg-gray-900 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-lg md:text-xl font-semibold">Ready when you are</h4>
            <p className="text-gray-600 dark:text-gray-400">
              Submit a request now or sign up your workshop to start receiving jobs.
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="px-6">Request Assistance</Button>
            <Button variant="outline" className="px-6">
              Sign Up Workshop
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}