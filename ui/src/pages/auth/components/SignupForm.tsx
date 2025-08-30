import React, { useEffect, useMemo, useRef, useState } from "react";

// Helper functions
function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
function formatSeconds(total) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function SignupForm() {
  const [form, setForm] = useState({ name: "", username: "", email: "", phone: "", otp: "" });
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [expiresAt, setExpiresAt] = useState(null);
  const [expiryLeft, setExpiryLeft] = useState(0);
  const otpRefs = useRef([]);

  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(form.email), [form.email]);
  const phoneDigits = useMemo(() => form.phone.replace(/\D/g, ""), [form.phone]);
  const phoneValid = useMemo(() => /^[0-9]{10,15}$/.test(phoneDigits), [phoneDigits]);

  const currentStep = useMemo(() => {
    if (!generatedOtp) return 1;
    const valid = expiresAt ? Date.now() < expiresAt : false;
    if (valid && form.otp.replace(/\D/g, "").length === 6) return 3;
    return 2;
  }, [generatedOtp, expiresAt, form.otp]);

  useEffect(() => {
    if (!secondsLeft) return;
    const t = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const now = Date.now();
      const left = Math.max(0, Math.ceil((expiresAt - now) / 1000));
      setExpiryLeft(left);
      if (left === 0) {
        setGeneratedOtp(null);
        setForm((f) => ({ ...f, otp: "" }));
        setExpiresAt(null);
        alert("OTP expired. Please resend a new OTP to continue.");
      }
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [expiresAt]);

  function onChange(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setOtpAt(index, char) {
    setForm((f) => {
      const arr = (f.otp || "").split("");
      while (arr.length < 6) arr.push("");
      arr[index] = char;
      return { ...f, otp: arr.join("").slice(0, 6) };
    });
  }

  async function handleGenerateOtp() {
    if (!form.name || !form.username || !emailValid || !phoneValid) {
      alert("Check your details: Provide name, username, a valid email, and mobile number before generating OTP.");
      return;
    }
    setSending(true);
    const code = genOtp();
    setGeneratedOtp(code);
    setSecondsLeft(30);
    setExpiresAt(Date.now() + 3 * 60 * 1000);
    alert(`OTP sent. For demo: your OTP is ${code}.`);
    setSending(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.otp !== generatedOtp) {
      alert("Invalid OTP: The code you entered is incorrect.");
      return;
    }
    setSubmitting(true);
    alert("Signup complete! Your Roadguard account has been created.");
    setForm({ name: "", username: "", email: "", phone: "", otp: "" });
    setGeneratedOtp(null);
    setSecondsLeft(0);
    setExpiresAt(null);
    setExpiryLeft(0);
    setSubmitting(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-2xl shadow-gray-200/40 dark:shadow-black/40">
      <div className="p-8">
        <ol className="mb-4 flex items-center gap-4 text-sm">
          {[1, 2, 3].map((n, i) => {
            const active = currentStep >= n;
            return (
              <li key={n} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                    active ? "border-amber-500 bg-amber-500 text-black" : "border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {n}
                </span>
                <span className={active ? "font-medium text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}>
                  {n === 1 ? "Details" : n === 2 ? "Verify" : "Done"}
                </span>
                {i < 2 && <span className="mx-2 h-px w-8 bg-gray-200 dark:bg-gray-800" aria-hidden="true" />}
              </li>
            );
          })}
        </ol>

        <form onSubmit={handleSubmit} className="grid gap-5 mt-8">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Full name</label>
            <input id="name" value={form.name} onChange={(e) => onChange("name", e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input id="username" value={form.username} onChange={(e) => onChange("username", e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input id="email" type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">Mobile number</label>
            <input id="phone" type="tel" value={form.phone} onChange={(e) => onChange("phone", e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white" />
          </div>
          
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="grid gap-2">
              <label htmlFor="otp-input-0" className="text-sm font-medium text-gray-700 dark:text-gray-300">One-Time Password</label>
              <div className="flex items-center gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <input
                    key={i}
                    id={`otp-input-${i}`}
                    ref={(el) => (otpRefs.current[i] = el)}
                    value={form.otp[i] ?? ""}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "");
                      const char = v.slice(-1);
                      setOtpAt(i, char);
                      if (char && i < 5) otpRefs.current[i + 1]?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !form.otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
                      if (e.key === "ArrowLeft" && i > 0) otpRefs.current[i - 1]?.focus();
                      if (e.key === "ArrowRight" && i < 5) otpRefs.current[i + 1]?.focus();
                    }}
                    inputMode="numeric"
                    pattern="[0-9]{1}"
                    maxLength={1}
                    disabled={!generatedOtp}
                    className="h-12 w-10 text-center font-mono text-lg tracking-widest border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 dark:bg-gray-900 disabled:bg-gray-200 dark:disabled:bg-gray-800"
                    aria-label={`OTP digit ${i + 1}`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
                {generatedOtp ? (expiryLeft > 0 ? `Expires in ${formatSeconds(expiryLeft)}.` : "OTP expired.") : "We'll send a code to your mobile."}
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerateOtp}
              disabled={sending || secondsLeft > 0}
              className="px-4 py-2 h-12 border rounded-md text-sm font-medium transition-colors border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : generatedOtp ? "Resend OTP" : "Generate OTP"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 rounded-md text-white font-semibold bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-amber-800 disabled:cursor-not-allowed"
            disabled={submitting || !generatedOtp || form.otp.replace(/\D/g, "").length !== 6}
          >
            {submitting ? "Submitting..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
