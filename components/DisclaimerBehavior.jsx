"use client";

import { useEffect } from "react";

const STORAGE_KEY = "gptimg2.disclaimer.dismissed";

export default function DisclaimerBehavior() {
  useEffect(() => {
    const disclaimer = document.querySelector("[data-disclaimer]");
    if (!disclaimer) return;

    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      dismissed = false;
    }

    if (dismissed) {
      disclaimer.setAttribute("hidden", "");
      document.body.classList.add("disclaimer-hidden");
      return;
    }

    const button = disclaimer.querySelector("[data-disclaimer-dismiss]");
    if (!button) return;

    const handleClick = () => {
      disclaimer.setAttribute("hidden", "");
      document.body.classList.add("disclaimer-hidden");
      try {
        window.localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // localStorage may be blocked; the dismiss is session-only
      }
    };

    button.addEventListener("click", handleClick);
    return () => button.removeEventListener("click", handleClick);
  }, []);

  return null;
}
