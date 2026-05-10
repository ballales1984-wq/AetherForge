"use client";

import { useState, useRef, useCallback, useMemo } from "react";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  onComplete?: () => void;
  disabled?: boolean;
}

/**
 * OTPInput - A 6-digit one-time password input component.
 *
 * Features:
 * - 6 individual input fields for each digit
 * - Automatic focus management between fields
 * - Paste support for 6-digit codes
 * - Keyboard navigation (arrow keys, backspace)
 * - Accessibility compliant (aria-label, aria-describedby, roles)
 * - Disabled state support
 */
export function OTPInput({
  value,
  onChange,
  length = 6,
  onComplete,
  disabled = false,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    Array(length).fill(null)
  );

  const digits = useMemo(() => {
    const padded = value.padEnd(length, " ");
    return padded.split("").slice(0, length);
  }, [value, length]);

  const handleChange = useCallback(
    (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const inputValue = event.target.value;
      // Only allow single digits
      const digit = inputValue.replace(/[^0-9]/g, "");

      if (digit.length === 0) {
        // Clear the current field
        const newDigits = [...digits];
        newDigits[index] = "";
        onChange(newDigits.join(""));
        return;
      }

      const newDigits = [...digits];
      newDigits[index] = digit[0];
      const newValue = newDigits.join("");
      onChange(newValue);

      // Auto-focus next input if available
      if (index < length - 1 && digit.length > 0) {
        inputRefs.current[index + 1]?.focus();
      }

      // Call onComplete when all digits are filled
      if (index === length - 1 || newValue.length === length) {
        const completeValue = newDigits.slice(0, length).join("");
        if (completeValue.replace(/\s/g, "").length === length) {
          onComplete?.();
        }
      }
    },
    [digits, disabled, length, onChange, onComplete]
  );

  const handleKeyDown = useCallback(
    (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      if (event.key === "Backspace") {
        event.preventDefault();

        if (digits[index] !== "" && digits[index] !== " ") {
          // Clear current digit
          const newDigits = [...digits];
          newDigits[index] = "";
          onChange(newDigits.join(""));
        } else if (index > 0) {
          // Move to previous field and clear it
          const newDigits = [...digits];
          newDigits[index - 1] = "";
          onChange(newDigits.join(""));
          inputRefs.current[index - 1]?.focus();
        }
        return;
      }

      if (event.key === "ArrowLeft" && index > 0) {
        event.preventDefault();
        inputRefs.current[index - 1]?.focus();
      }

      if (event.key === "ArrowRight" && index < length - 1) {
        event.preventDefault();
        inputRefs.current[index + 1]?.focus();
      }

      // Allow only digits and control keys
      if (
        event.key !== "Tab" &&
        event.key !== "ArrowLeft" &&
        event.key !== "ArrowRight" &&
        /\D/.test(event.key)
      ) {
        event.preventDefault();
      }
    },
    [digits, disabled, length, onChange, inputRefs]
  );

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      const pastedData = event.clipboardData
        .getData("text")
        .replace(/[^0-9]/g, "")
        .slice(0, length);

      if (pastedData.length > 0) {
        onChange(pastedData);

        // Focus on the field after the last pasted digit
        const focusIndex = Math.min(pastedData.length, length - 1);
        inputRefs.current[focusIndex]?.focus();
      }
    },
    [disabled, length, onChange, inputRefs]
  );

  const handleFocus = useCallback(
    (index: number) => {
      if (disabled) return;
      // Select all text on focus for easy replacement
      inputRefs.current[index]?.select();
    },
    [disabled]
  );

  return (
    <div className="flex items-center justify-center gap-2" role="group" aria-label={`${length}-digit verification code`}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="one-time-code"
          maxLength={1}
          value={digits[index] === " " ? "" : digits[index]}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-describedby="otp-instruction"
          className="w-12 h-14 text-center text-2xl font-mono font-semibold rounded-xl border-2 bg-white/5 text-white placeholder-white/20 focus:border-cyan-400/80 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed data-[invalid='true']:border-red-500/50"
          data-invalid={
            value.length === length &&
            !value.split("").every((d) => d !== " ")
              ? "false"
              : undefined
          }
        />
      ))}
      <span id="otp-instruction" className="sr-only">
        Enter {length}-digit verification code
      </span>
    </div>
  );
}