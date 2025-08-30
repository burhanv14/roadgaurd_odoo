import React from "react";
import LoginHero from "./components/LoginHero.jsx";
import LoginForm from "./components/LoginForm.jsx";


// --- Main LoginPage Component ---
export default function LoginPage() {
    return (
      <main className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <section className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
          <div className="mb-6 text-center lg:text-left">
            <p className="text-xs font-medium tracking-widest text-amber-600 dark:text-amber-500">Roadguard • Log in</p>
          </div>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <LoginHero />
            <div>
              <h1 className="mb-2 text-3xl font-semibold tracking-tight text-balance">Log in to your account</h1>
              <p className="mb-8 text-sm text-gray-600 dark:text-gray-400">
                Enter your credentials to access your RoadGuard dashboard.
              </p>
              <LoginForm />
              <p className="mt-6 text-xs text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <a href="#" className="underline underline-offset-4 hover:text-amber-600 dark:hover:text-amber-500">
                  Sign up
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

