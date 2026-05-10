/**
 * Verification Token Utility
 *
 * Generates and validates time-based verification tokens for email
 * verification flows. Uses a deterministic approach based on the
 * current time window and a secret key.
 *
 * In a production environment, this would be replaced with a server-side
 * API call that sends actual emails with real tokens.
 */

const VERIFICATION_TOKEN_LENGTH = 6;
const TOKEN_EXPIRY_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds

/**
 * Generate a deterministic 6-digit verification token based on the
 * current time window. This simulates server-side token generation.
 * In production, tokens should be generated server-side and sent via email.
 */
export function generateVerificationToken(): string {
  const timeWindow = Math.floor(Date.now() / TOKEN_EXPIRY_WINDOW_MS);
  // Deterministic pseudo-random based on time window
  let seed = timeWindow * 7919 + 1013; // Prime-based hash
  let token = "";
  for (let i = 0; i < VERIFICATION_TOKEN_LENGTH; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    token += String(seed % 10);
  }
  return token;
}

/**
 * Validate a user-entered token against the expected token.
 */
export function validateToken(input: string, expected: string): boolean {
  return input === expected;
}

/**
 * Check if a token has expired based on its creation timestamp.
 */
export function isTokenExpired(createdAt: number): boolean {
  return Date.now() - createdAt > TOKEN_EXPIRY_WINDOW_MS;
}

/**
 * Check if resend is still in cooldown period.
 */
export function isResendCooldown(lastSentAt: number): boolean {
  return Date.now() - lastSentAt < RESEND_COOLDOWN_MS;
}

/**
 * Get remaining seconds for resend cooldown.
 */
export function getResendCooldownSeconds(lastSentAt: number): number {
  const remaining = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - lastSentAt)) / 1000);
  return Math.max(0, remaining);
}

/**
 * Get remaining seconds for token expiry.
 */
export function getTokenExpirySeconds(createdAt: number): number {
  const remaining = Math.ceil((TOKEN_EXPIRY_WINDOW_MS - (Date.now() - createdAt)) / 1000);
  return Math.max(0, remaining);
}