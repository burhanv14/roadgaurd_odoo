import React, { useState } from "react";

// --- LoginForm Component ---
export default function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    if (!identifier || !password) {
      alert("Please enter both your identifier and password.");
      return;
    }
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      alert(`Logged in successfully!\nIdentifier: ${identifier}`);
      // Reset form state
      setIdentifier("");
      setPassword("");
      setSubmitting(false);
    }, 1000);
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl shadow-gray-200/40 dark:shadow-black/40">
      <div className="p-8">
        <div className="space-y-1 mb-8">
          <h2 className="text-balance text-2xl font-semibold text-gray-900 dark:text-white">Welcome back</h2>
          <p className="text-pretty text-sm text-gray-600 dark:text-gray-400">
            Enter your credentials to access your account.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-2">
            <label htmlFor="identifier" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email or username</label>
            <input
              id="identifier"
              placeholder="you@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              required
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <a href="#" className="text-xs text-amber-600 hover:underline dark:text-amber-500">
                Forgot password?
              </a>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting} 
            className="w-full px-4 py-3 rounded-md text-white font-semibold bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-amber-800 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

