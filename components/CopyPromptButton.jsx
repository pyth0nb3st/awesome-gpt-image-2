"use client";

import { useEffect, useRef, useState } from "react";

const RESET_DELAY_MS = 1800;

const copyWithFallback = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    return document.execCommand("copy");
  } finally {
    textarea.remove();
  }
};

export default function CopyPromptButton({ text, labels, className = "" }) {
  const [status, setStatus] = useState("idle");
  const resetTimer = useRef(null);

  useEffect(
    () => () => {
      if (resetTimer.current) {
        window.clearTimeout(resetTimer.current);
      }
    },
    [],
  );

  const resetStatusSoon = () => {
    if (resetTimer.current) {
      window.clearTimeout(resetTimer.current);
    }
    resetTimer.current = window.setTimeout(() => setStatus("idle"), RESET_DELAY_MS);
  };

  const copyPrompt = async () => {
    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else if (!copyWithFallback(text)) {
        throw new Error("Clipboard copy failed");
      }
      setStatus("copied");
    } catch {
      setStatus("failed");
    } finally {
      resetStatusSoon();
    }
  };

  const label = status === "copied" ? labels.copied : status === "failed" ? labels.failed : labels.copy;

  return (
    <button className={`copy-prompt is-${status}${className ? ` ${className}` : ""}`} type="button" onClick={copyPrompt} aria-live="polite">
      {label}
    </button>
  );
}
