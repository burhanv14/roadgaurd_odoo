import React, { useEffect, useMemo, useRef, useState } from "react";

// --- Mock/Helper Components & Functions ---
// In a real app, these would be in separate files.

/**
 * Mock Trans component to make the example runnable.
 * It simply renders the default text.
 */
const Trans: React.FC<{ translationKey: string; text: string }> = ({ text }) => {
  return <>{text}</>;
};

/**
 * Generates a random 6-digit OTP.
 * @returns A string representing the 6-digit code.
 */
function genOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Formats a total number of seconds into a m:ss string.
 * @param total - The total seconds.
 * @returns A formatted string like "2:59".
 */
function formatSeconds(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// --- Main SignupForm Component ---

export default function SignupForm() {
  // Using React's useState for form state management
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  // Local state for OTP functionality
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [expiryLeft, setExpiryLeft] = useState(0);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Memoized calculations for validation and step logic
  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const phoneDigits = useMemo(() => phone.replace(/\D/g, ""), [phone]);
  const phoneValid = useMemo(() => /^[0-9]{10,15}$/.test(phoneDigits), [phoneDigits]);

  const currentStep = useMemo(() => {
    if (!generatedOtp) return 1;
    const isOtpValid = expiresAt ? Date.now() < expiresAt : false;
    if (isOtpValid && otp.replace(/\D/g, "").length === 6) return 3;
    return 2;
  }, [generatedOtp, expiresAt, otp]);

  // Timer for the "Resend OTP" button cooldown
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Timer for OTP expiry countdown
  useEffect(() => {
    if (!expiresAt) return;
    
    const tick = () => {
      const now = Date.now();
      const left = Math.max(0, Math.ceil((expiresAt - now) / 1000));
      setExpiryLeft(left);

      if (left === 0) {
        setGeneratedOtp(null);
        setOtp("");
        setExpiresAt(null);
        // NOTE: In a real app, use a toast notification instead of alert.
        alert("OTP expired. Please resend a new OTP to continue.");
      }
    };

    tick(); // Run once immediately
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  /**
   * Updates the OTP string at a specific index.
   */
  function setOtpAt(index: number, char: string) {
    const otpArray = otp.split('');
    // Ensure array is long enough
    while (otpArray.length < 6) otpArray.push('');
    otpArray[index] = char;
    setOtp(otpArray.join("").slice(0, 6));
  }

  /**
   * Handles the logic for generating and sending an OTP.
   */
  async function handleGenerateOtp() {
    if (!name || !username || !emailValid || !phoneValid) {
      alert("Check your details: Provide name, username, a valid email, and mobile number before generating OTP.");
      return;
    }
    setSending(true);
    const code = genOtp();
    setGeneratedOtp(code);
    setSecondsLeft(30); // 30-second resend cooldown
    setExpiresAt(Date.now() + 3 * 60 * 1000); // 3-minute expiry
    alert(`OTP sent. For demo: your OTP is ${code}.`);
    setSending(false);
  }

  /**
   * Handles the final form submission.
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (otp !== generatedOtp) {
      alert("Invalid OTP: The code you entered is incorrect.");
      return;
    }
    setSubmitting(true);
    alert("Signup complete! Your Roadguard account has been created.");
    
    // Clear all form data from state
    setName('');
    setUsername('');
    setEmail('');
    setPhone('');
    setPassword('');
    setOtp('');
    setGeneratedOtp(null);
    setSecondsLeft(0);
    setExpiresAt(null);
    setExpiryLeft(0);
    
    setSubmitting(false);
  }

  // --- JSX Rendering ---
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
                  <Trans 
                    translationKey={`signup.form.step${n}`}
                    text={n === 1 ? "Details" : n === 2 ? "Verify" : "Done"}
                  />
                </span>
                {i < 2 && <span className="mx-2 h-px w-8 bg-gray-200 dark:bg-gray-800" aria-hidden="true" />}
              </li>
            );
          })}
        </ol>

        <form onSubmit={handleSubmit} className="grid gap-5 mt-8">
          {/* ----- Step 1: User Details ----- */}
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <Trans translationKey="signup.form.fullName" text="Full name" />
            </label>
            <input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              disabled={currentStep > 1}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white disabled:opacity-70"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <Trans translationKey="signup.form.username" text="Username" />
            </label>
            <input 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              disabled={currentStep > 1}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white disabled:opacity-70"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <Trans translationKey="signup.form.email" text="Email" />
            </label>
            <input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={currentStep > 1}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white disabled:opacity-70"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <Trans translationKey="signup.form.mobileNumber" text="Mobile number" />
            </label>
            <input 
              id="phone" 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              required 
              disabled={currentStep > 1}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white disabled:opacity-70"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <Trans translationKey="signup.form.password" text="Password" />
            </label>
            <input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              disabled={currentStep > 1}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white disabled:opacity-70"
            />
          </div>
          
          {/* ----- Step 2: OTP Verification ----- */}
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="grid gap-2">
              <label htmlFor="otp-input-0" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <Trans translationKey="signup.form.otp" text="One-Time Password" />
              </label>
              <div className="flex items-center gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <input
                    key={i}
                    id={`otp-input-${i}`}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    value={otp[i] ?? ""}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "");
                      const char = v.slice(-1);
                      setOtpAt(i, char);
                      if (char && i < 5) otpRefs.current[i + 1]?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
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
                {generatedOtp ? (
                  expiryLeft > 0 ? (
                    <Trans translationKey="signup.form.otpExpiry" text={`Expires in ${formatSeconds(expiryLeft)}.`} />
                  ) : (
                    <Trans translationKey="signup.form.otpExpired" text="OTP expired." />
                  )
                ) : (
                  <Trans translationKey="signup.form.otpInfo" text="We'll send a code to your mobile." />
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerateOtp}
              disabled={sending || secondsLeft > 0}
              className="px-4 py-2 h-12 border rounded-md text-sm font-medium transition-colors border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 hover:bg-gray-100 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trans 
                translationKey="signup.form.generateOtpBtn" 
                text={
                  secondsLeft > 0 
                    ? `Resend in ${secondsLeft}s` 
                    : generatedOtp 
                      ? "Resend OTP" 
                      : "Generate OTP"
                } 
              />
            </button>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 rounded-md text-white font-semibold bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-amber-800 disabled:cursor-not-allowed"
            disabled={submitting || !generatedOtp || otp.replace(/\D/g, "").length !== 6}
          >
            <Trans 
              translationKey="signup.form.submitBtn" 
              text={submitting ? "Submitting..." : "Create Account"} 
            />
          </button>
        </form>
      </div>
    </div>
  );
}

