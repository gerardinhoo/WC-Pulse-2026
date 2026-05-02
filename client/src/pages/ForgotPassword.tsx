import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const emailValid = /\S+@\S+\.\S+/.test(email.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailValid) {
      setError("Enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post("/auth/forgot-password", {
        email: email.trim(),
      });
      setMessage(response.data.message);
      setSubmittedEmail(email.trim());
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setError(
        axiosErr.response?.data?.error ||
          "We couldn't send a reset link right now. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[50vh] py-10 animate-fade-in">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm p-8" noValidate>
        <h2 className="text-2xl font-bold mb-1">Reset your password</h2>
        {!message ? (
          <>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              Enter the email you use for PitchPulse 26 and we&apos;ll send a reset link.
            </p>

            {error && (
              <p
                role="alert"
                className="text-red-400 text-sm mb-3 bg-red-400/10 rounded-md px-3 py-2"
              >
                {error}
              </p>
            )}

            <div className="mb-4">
              <label htmlFor="forgot-password-email" className="block text-sm font-medium mb-1.5">
                Email address
              </label>
              <input
                id="forgot-password-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                inputMode="email"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !emailValid}
              className="w-full bg-[var(--color-accent)] text-white py-2.5 rounded-lg font-medium hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50"
            >
              {submitting ? "Sending link..." : "Send reset link"}
            </button>

            <p className="text-sm text-[var(--color-text-muted)] mt-4 text-center">
              Remembered it?{" "}
              <Link to="/login" className="text-[var(--color-accent)] hover:underline">
                Back to sign in
              </Link>
            </p>
          </>
        ) : (
          <div className="space-y-4">
            <p
              role="status"
              className="text-emerald-300 text-sm bg-emerald-400/10 rounded-md px-3 py-2"
            >
              {message}
            </p>
            <p className="text-sm text-[var(--color-text-muted)]">
              {submittedEmail
                ? `Check ${submittedEmail} for the reset email.`
                : "Check your inbox for the reset email."}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Didn&apos;t get it? Wait a minute, then return here to request another link.
            </p>
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Back to sign in
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}
