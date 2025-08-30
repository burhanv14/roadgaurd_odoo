import React, { useEffect, useMemo, useRef, useState } from "react";

/** ---------- Minimal nuqs-like parser utilities ---------- */

interface ParserOptions<T = any> {
  parse?: (value: string) => T;
  serialize?: (value: T) => string;
  defaultValue: T;
}

const createParser = <T,>(options: ParserOptions<T>) => ({
  parse: options.parse ?? ((value: string) => value as unknown as T),
  serialize: options.serialize ?? ((value: T) => String(value)),
  defaultValue: options.defaultValue,
});

const parseAsString = createParser<string>({ defaultValue: "" });
const parseAsInteger = createParser<number>({
  parse: (value: string) => {
    const n = parseInt(value, 10);
    return Number.isFinite(n) ? n : 0;
  },
  serialize: (value: number) => String(value),
  defaultValue: 0,
});

/** WARNING: even hashed passwords in URLs can leak via logs/referrers. */
const parseAsEncryptedPassword = createParser<string>({
  parse: (value: string) => value,
  serialize: (value: string) => value ?? "",
  defaultValue: "",
});

/** ---------- Fixed mock of nuqs' useQueryState ---------- */
/**
 * Syncs a single query param with React state.
 * - Reads initial value from URL using parser.
 * - Writes on set (replaceState).
 * - Removes param when equal to defaultValue.
 * - Listens to popstate to stay in sync with back/forward.
 */
function useQueryState<T>(
  key: string,
  parser: ReturnType<typeof createParser<T>>
) {
  // Read from current URL
  const readFromURL = (): T => {
    const sp = new URLSearchParams(window.location.search);
    const raw = sp.get(key);
    return raw !== null ? parser.parse(raw) : parser.defaultValue;
  };

  const [value, setValue] = useState<T>(() => {
    try {
      return typeof window !== "undefined" ? readFromURL() : parser.defaultValue;
    } catch {
      return parser.defaultValue;
    }
  });

  // Keep state in sync when user navigates with back/forward
  useEffect(() => {
    const onPopState = () => {
      try {
        setValue(readFromURL());
      } catch {
        // ignore
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Single place to write to URL
  const writeToURL = (next: T) => {
    const url = new URL(window.location.href);
    const sp = url.searchParams;

    // remove when default to keep URL clean
    const isDefault =
      (typeof next === "string" && typeof parser.defaultValue === "string"
        ? next === (parser.defaultValue as unknown as string)
        : JSON.stringify(next) === JSON.stringify(parser.defaultValue));

    if (isDefault || next === ("" as unknown as T) || next === (null as unknown as T)) {
      sp.delete(key);
    } else {
      sp.set(key, parser.serialize(next));
    }

    // Keep hash/path; avoid history spam
    const newUrl = `${url.pathname}?${sp.toString()}${url.hash}`;
    window.history.replaceState(null, "", newUrl);
  };

  // Setter that supports both next value and updater fn
  const setQueryValue = (next: React.SetStateAction<T>) => {
    setValue((prev) => {
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      try {
        writeToURL(resolved);
      } catch {
        // ignore URL write errors
      }
      return resolved;
    });
  };

  return [value, setQueryValue] as const;
}

/** ---------- Helpers you already had ---------- */

const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = ((hash << 5) - hash) + password.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

const Trans = ({ text }: { text: string }) => <>{text}</>;

function genOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function formatSeconds(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** ---------- Your component (unchanged logic, now URL-synced) ---------- */

export default function SignupForm() {
  const [name, setName] = useQueryState("name", parseAsString);
  const [username, setUsername] = useQueryState("username", parseAsString);
  const [email, setEmail] = useQueryState("email", parseAsString);
  const [phone, setPhone] = useQueryState("phone", parseAsString);
  const [passwordHash, setPasswordHash] = useQueryState("passwordHash", parseAsEncryptedPassword);
  const [otp, setOtp] = useQueryState("otp", parseAsString);

  const [password, setPassword] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useQueryState("secondsLeft", parseAsInteger);
  const [expiresAt, setExpiresAt] = useQueryState("expiresAt", parseAsInteger);
  const [expiryLeft, setExpiryLeft] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (password) setPasswordHash(hashPassword(password));
    else setPasswordHash(""); // keep URL tidy when cleared
  }, [password, setPasswordHash]);

  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const phoneDigits = useMemo(() => (phone || "").replace(/\D/g, ""), [phone]);
  const phoneValid = useMemo(() => /^[0-9]{10,15}$/.test(phoneDigits), [phoneDigits]);

  const currentStep = useMemo(() => {
    if (!generatedOtp) return 1;
    const isOtpValid = expiresAt ? Date.now() < expiresAt : false;
    if (isOtpValid && otp.replace(/\D/g, "").length === 6) return 3;
    return 2;
  }, [generatedOtp, expiresAt, otp]);

  // Cooldown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [secondsLeft, setSecondsLeft]);

  // Expiry countdown
  useEffect(() => {
    if (!expiresAt) return;

    const tick = () => {
      const now = Date.now();
      const left = Math.max(0, Math.ceil((expiresAt - now) / 1000));
      setExpiryLeft(left);

      if (left === 0) {
        setGeneratedOtp(null);
        setOtp("");
        setExpiresAt(0);
        alert("OTP expired. Please resend a new OTP to continue.");
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt, setOtp, setExpiresAt]);

  function setOtpAt(index: number, char: string) {
    const otpArray = otp.split("");
    while (otpArray.length < 6) otpArray.push("");
    otpArray[index] = char;
    setOtp(otpArray.join("").slice(0, 6));
  }

  async function handleGenerateOtp() {
    if (!name || !username || !emailValid || !phoneValid) {
      alert(
        "Check your details: Provide name, username, a valid email, and mobile number before generating OTP."
      );
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (otp !== generatedOtp) {
      alert("Invalid OTP: The code you entered is incorrect.");
      return;
    }
    setSubmitting(true);
    alert("Signup complete! Your Roadguard account has been created.");

    // Clear nuqs state
    setName("");
    setUsername("");
    setEmail("");
    setPhone("");
    setPasswordHash("");
    setOtp("");
    setSecondsLeft(0);
    setExpiresAt(0);

    // Clear local state
    setPassword("");
    setGeneratedOtp(null);
    setExpiryLeft(0);

    setSubmitting(false);
  }

  const debugInfo = {
    name,
    username,
    email,
    phone,
    passwordHash,
    otp,
    secondsLeft,
    expiresAt,
  };

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
                    active
                      ? "border-amber-500 bg-amber-500 text-black"
                      : "border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {n}
                </span>
                <span
                  className={
                    active
                      ? "font-medium text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                  }
                >
                  <Trans text={n === 1 ? "Details" : n === 2 ? "Verify" : "Done"} />
                </span>
                {i < 2 && (
                  <span
                    className="mx-2 h-px w-8 bg-gray-200 dark:bg-gray-800"
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>

        <form onSubmit={handleSubmit} className="grid gap-5 mt-8">
          {/* Step 1 */}
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <Trans text="Full name" />
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
              <Trans text="Username" />
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
              <Trans text="Email" />
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
              <Trans text="Mobile number" />
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
              <Trans text="Password" />
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

          {/* Step 2: OTP */}
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="grid gap-2">
              <label htmlFor="otp-input-0" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <Trans text="One-Time Password" />
              </label>
              <div className="flex items-center gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <input
                    key={i}
                    id={`otp-input-${i}`}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
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
                    <Trans text={`Expires in ${formatSeconds(expiryLeft)}.`} />
                  ) : (
                    <Trans text="OTP expired." />
                  )
                ) : (
                  <Trans text="We'll send a code to your mobile." />
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
            <Trans text={submitting ? "Submitting..." : "Create Account"} />
          </button>
        </form>
      </div>
    </div>
  );
}
