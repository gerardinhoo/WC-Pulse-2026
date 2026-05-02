import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const passwordValid = password.length >= 8;
  const tokenValid = token.length >= 10;

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      navigate("/login", {
        replace: true,
        state: { resetSuccess: true },
      });
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [message, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokenValid) {
      setError("This reset link is missing or invalid. Request a new one.");
      return;
    }

    if (!passwordValid) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post("/auth/reset-password", { token, password });
      setMessage(response.data.message);
      setPassword("");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setError(
        axiosErr.response?.data?.error ||
          "We couldn't reset your password right now. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[50vh] py-10 animate-fade-in">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm p-8" noValidate>
        <h2 className="text-2xl font-bold mb-1">Choose a new password</h2>
        {!message ? (
          <>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              Set a new password for your account, then head back to sign in.
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
              <label htmlFor="reset-password" className="block text-sm font-medium mb-1.5">
                New password
              </label>
              <input
                id="reset-password"
                type="password"
                name="password"
                placeholder="Enter a new password"
                autoComplete="new-password"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Use at least 8 characters for your new password.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || !passwordValid || !tokenValid}
              className="w-full bg-[var(--color-accent)] text-white py-2.5 rounded-lg font-medium hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50"
            >
              {submitting ? "Resetting..." : "Reset password"}
            </button>

            <p className="text-sm text-[var(--color-text-muted)] mt-4 text-center">
              Back to{" "}
              <Link to="/login" className="text-[var(--color-accent)] hover:underline">
                sign in
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
              Your password has been updated. Redirecting you to sign in...
            </p>
            <Link
              to="/login"
              state={{ resetSuccess: true }}
              replace
              className="inline-flex w-full items-center justify-center rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              Go to sign in now
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}
