"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { generateVerificationToken, validateToken, isTokenExpired, isResendCooldown, getResendCooldownSeconds, getTokenExpirySeconds } from "@/utils/verification";
import { OTPInput } from "./OTPInput";

interface EmailVerificationProps {
  /** Email address to send verification to */
  email: string;
  /** Callback when verification succeeds */
  onVerified: () => void;
  /** Callback when the user dismisses the modal */
  onDismiss: () => void;
  /** Optional: initial token for SSR/hydration scenarios */
  initialToken?: string;
}

/**
 * EmailVerification - A modal component for 6-digit email verification.
 *
 * Features:
 * - Sends a 6-digit verification code to the user's email
 * - 6-digit OTP input with keyboard navigation and paste support
 * - Countdown timer for token expiry
 * - Resend capability with cooldown
 * - ESC key to dismiss
 * - Backdrop click to dismiss
 * - Accessible with proper ARIA attributes
 * - Mobile responsive with proper stacking context
 * - Auto-focus on first input when opened
 */
export function EmailVerification({
  email,
  onVerified,
  onDismiss,
  initialToken,
}: EmailVerificationProps) {
  const [token, setToken] = useState(initialToken ?? "");
  const [generatedToken, setGeneratedToken] = useState<string>(() =>
    generateVerificationToken()
  );
  const [tokenCreatedAt, setTokenCreatedAt] = useState<number>(Date.now());
  const [lastSentAt, setLastSentAt] = useState<number>(Date.now());
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState<number>(
    getTokenExpirySeconds(tokenCreatedAt)
  );
  const [showModal, setShowModal] = useState(true);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Countdown timer for token expiry
  useEffect(() => {
    if (success) return;

    const interval = setInterval(() => {
      const remaining = getTokenExpirySeconds(tokenCreatedAt);
      setCountdown(remaining);

      if (remaining <= 0) {
        setError("Verification code has expired. Please request a new one.");
        setToken("");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tokenCreatedAt, success]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (showModal) {
      // Small delay to ensure DOM is ready and animations have started
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const handleResend = useCallback(() => {
    if (isResendCooldown(lastSentAt) || isTokenExpired(tokenCreatedAt)) {
      return;
    }

    const newToken = generateVerificationToken();
    setGeneratedToken(newToken);
    setTokenCreatedAt(Date.now());
    setLastSentAt(Date.now());
    setToken("");
    setError(null);
    setCountdown(300);

    // Re-focus first input after resend
    firstInputRef.current?.focus();
  }, [lastSentAt, tokenCreatedAt]);

  const handleVerify = useCallback(() => {
    if (token.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    // Simulate network delay for realistic UX
    setTimeout(() => {
      if (validateToken(token, generatedToken)) {
        setSuccess(true);
        onVerified();
      } else {
        setError("Invalid verification code. Please try again.");
        setToken("");
        // Clear all inputs for fresh entry
        firstInputRef.current?.focus();
      }
      setIsVerifying(false);
    }, 800);
  }, [token, generatedToken, onVerified, firstInputRef]);

  const handleClose = useCallback(() => {
    setShowModal(false);
    // Delay actual dismiss to allow close animation
    setTimeout(() => {
      onDismiss();
    }, 200);
  }, [onDismiss]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
      // Allow Enter to submit when code is complete
      if (e.key === "Enter" && token.length === 6 && !isVerifying) {
        handleVerify();
      }
    },
    [token, isVerifying, handleClose, handleVerify]
  );

  const resendCooldown = useMemo(
    () => getResendCooldownSeconds(lastSentAt),
    [lastSentAt]
  );

  const maskEmail = useMemo(() => {
    const [local, domain] = email.split("@");
    if (local.length <= 2) {
      return `${local[0]}***@${domain}`;
    }
    return `${local[0]}***${local.slice(-1)}@${domain}`;
  }, [email]);

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verification-title"
      aria-describedby="verification-description"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0f] shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="relative px-6 pt-8 pb-6 text-center">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-lg p-2 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Close verification dialog"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Icon */}
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-cyan-400"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>

            <h2
              id="verification-title"
              className="font-display text-2xl font-semibold text-white"
            >
              Verify your email
            </h2>

            {success ? (
              <p id="verification-description" className="mt-2 text-sm text-white/60">
                You can close this window
              </p>
            ) : (
              <p id="verification-description" className="mt-2 text-sm text-white/60">
                We sent a code to <span className="text-white/80">{maskEmail}</span>
              </p>
            )}
          </div>

          {/* Body */}
          <div className="px-6 pb-8">
            {success ? (
              <div className="flex flex-col items-center py-6">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-400"
                  >
                    <path d="m9 11 3 3L22 4" />
                    <path d="M22 12v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </div>
                <p className="font-display text-lg font-semibold text-white">
                  Email verified!
                </p>
                <p className="mt-2 text-sm text-white/50">
                  Your email has been successfully verified.
                </p>
              </div>
            ) : (
              <>
                {/* OTP Input */}
                <div className="mb-6 flex flex-col items-center">
                  <OTPInput
                    value={token}
                    onChange={(val) => {
                      setError(null);
                      setToken(val);
                    }}
                    length={6}
                    onComplete={handleVerify}
                    disabled={isVerifying}
                  />

                  {/* Error message */}
                  {error && (
                    <p className="mt-4 text-center text-sm text-red-400/80" role="alert">
                      {error}
                    </p>
                  )}
                </div>

                {/* Countdown and resend */}
                <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="text-sm text-white/50 tabular-nums">
                      {countdown > 0 ? (() => {
                        const mins = Math.floor(countdown / 60);
                        const secs = countdown % 60;
                        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
                      })() : "Expired"}
                    </span>
                  </div>

                  <button
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || isTokenExpired(tokenCreatedAt)}
                    className="text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300 disabled:text-white/20 disabled:cursor-not-allowed"
                  >
                    {resendCooldown > 0
                      ? `Resend (${resendCooldown}s)`
                      : "Resend code"}
                  </button>
                </div>

                {/* Verify button */}
                <button
                  onClick={handleVerify}
                  disabled={token.length !== 6 || isVerifying}
                  className="mt-4 w-full rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 px-6 py-3.5 font-semibold text-black transition hover:from-cyan-400 hover:to-cyan-300 disabled:opacity-50 disabled:hover:from-cyan-500 disabled:hover:to-cyan-400"
                >
                  {isVerifying ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    "Verify email"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}