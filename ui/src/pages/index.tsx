import { useEffect, useRef } from "react"

// Odoo Logo Component - Replace the SVG content below with your actual logo SVG
function OdooLogo({ className = "h-8 w-auto", ...props }: { className?: string; [key: string]: any }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 120 40" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Replace this placeholder with your actual Odoo logo SVG paths */}
      <rect x="10" y="10" width="20" height="20" rx="4" fill="#714B67"/>
      <rect x="35" y="15" width="15" height="10" rx="2" fill="#714B67"/>
      <rect x="55" y="12" width="18" height="16" rx="3" fill="#714B67"/>
      <rect x="78" y="15" width="15" height="10" rx="2" fill="#714B67"/>
      <rect x="98" y="12" width="18" height="16" rx="3" fill="#714B67"/>
      <text x="10" y="38" fontSize="8" fill="#714B67" fontFamily="Arial, sans-serif">ODOO</text>
    </svg>
  )
}

function useFloating(delta = 20, duration = 4000) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let start: number | null = null
    const dir = 1
    let raf = 0
    const loop = (t: number) => {
      if (start == null) start = t
      const progress = (t - start) / duration
      const y = Math.sin(progress * Math.PI * 2) * delta * dir
      el.style.transform = `translateY(${y}px)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [delta, duration])
  return ref
}

export default function HeroAnimated() {
  const carRef = useFloating(8, 5000)

  const brandColor = "#714B67" // Odoo brand color

  return (
    <>
      <style>
        {`
          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .marquee {
            animation: marquee 18s linear infinite;
          }
          .mask-gradient {
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
        `}
      </style>
      
      <section className="relative isolate overflow-hidden pt-24 md:pt-32">
        {/* Background stripes in brand color (very subtle, accessible) */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-20 dark:opacity-15" aria-hidden="true">
          <div className="absolute left-0 top-0 h-full w-[120%] -rotate-2 bg-[repeating-linear-gradient(90deg,rgba(113,75,103,0.12)_0,rgba(113,75,103,0.12)_8px,transparent_8px,transparent_24px)]" />
        </div>

        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="mb-2 inline-flex items-center rounded-full border bg-white dark:bg-gray-900 px-2 py-1 text-xs text-gray-600 dark:text-gray-400">
                24x7 Nationwide Service
              </p>
              <h1 className="text-pretty text-3xl font-semibold leading-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
                Instant Roadside Assistance, wherever you are.
              </h1>
              <p className="mt-4 max-w-prose text-balance text-gray-600 dark:text-gray-400">
                Flat tire? Dead battery? Towing? Get expert help on-demand with trusted technicians and fast ETAs.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  className="border-0 px-6 py-5 text-base font-medium shadow-sm transition-transform rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:scale-105"
                  style={{ backgroundColor: brandColor, color: "black" }}
                >
                  Get Help Now
                </button>
                <button className="px-6 py-5 text-base bg-transparent border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                  Explore Plans
                </button>
              </div>

              {/* Trust badges / counters */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { k: "Cities", v: "700+" },
                  { k: "Assists", v: "2M+" },
                  { k: "Response", v: "~30min" },
                ].map((s) => (
                  <div key={s.k} className="rounded-md border bg-white dark:bg-gray-900 p-4 text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{s.v}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{s.k}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div
                ref={carRef}
                className="mx-auto flex h-56 w-full max-w-md items-end justify-center rounded-xl border bg-white dark:bg-gray-900 p-6 shadow-sm"
                aria-label="Animated roadside illustration"
              >
                {/* Simple car illustration using shapes to avoid external assets */}
                <div className="relative h-24 w-40">
                  <div className="absolute left-0 top-5 h-10 w-40 rounded-md bg-gray-900 dark:bg-gray-100" />
                  <div className="absolute left-2 top-0 h-8 w-32 rounded-t-lg bg-gray-900 dark:bg-gray-100" />
                  <div className="absolute left-5 top-2 h-4 w-10 rounded-sm bg-white/70 dark:bg-gray-900/70" />
                  <div className="absolute right-6 top-2 h-4 w-10 rounded-sm bg-white/70 dark:bg-gray-900/70" />
                  {/* wheels */}
                  <div className="absolute -bottom-4 left-6 h-10 w-10 rounded-full bg-black ring-2 ring-white dark:ring-gray-900">
                    <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white dark:bg-gray-900" />
                  </div>
                  <div className="absolute -bottom-4 right-6 h-10 w-10 rounded-full bg-black ring-2 ring-white dark:ring-gray-900">
                    <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white dark:bg-gray-900" />
                  </div>
                </div>
              </div>

              {/* Scrolling services marquee */}
              <div className="mt-6 overflow-hidden rounded-md border bg-white dark:bg-gray-900">
                <div
                  className="flex marquee gap-8 whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400 mask-gradient"
                  aria-label="Service types marquee"
                >
                  {[
                    "Towing",
                    "Battery Jumpstart",
                    "Flat Tyre",
                    "Fuel Delivery",
                    "Key Lockout",
                    "Minor Repairs",
                    "On-spot Support",
                  ].map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-2">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: brandColor }}
                        aria-hidden="true"
                      />
                      {s}
                    </span>
                  ))}
                  {/* duplicate for seamless loop */}
                  {[
                    "Towing",
                    "Battery Jumpstart",
                    "Flat Tyre",
                    "Fuel Delivery",
                    "Key Lockout",
                    "Minor Repairs",
                    "On-spot Support",
                  ].map((s, i) => (
                    <span key={`dup-${i}`} className="inline-flex items-center gap-2">
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: brandColor }}
                        aria-hidden="true"
                      />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Plans teaser cards */}
                        <div className="mt-16 grid gap-4 md:grid-cols-3">
            {[
              { t: "On-Demand Help", d: "Get assistance anywhere, anytime." },
              { t: "Annual RSA Plans", d: "Affordable protection for your vehicle." },
              { t: "Business Services", d: "Scale assistance for fleets & partners." },
            ].map((c) => (
              <div key={c.t} className="rounded-lg border bg-white dark:bg-gray-900 p-5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-sm" style={{ backgroundColor: brandColor }}>
                  <OdooLogo className="h-6 w-6 text-white" />
                </div>
                <div className="text-base font-semibold text-gray-900 dark:text-white">{c.t}</div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}