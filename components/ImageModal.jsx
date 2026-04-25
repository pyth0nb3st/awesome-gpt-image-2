"use client";

import { useEffect } from "react";
import { getCopy } from "../lib/i18n";

export default function ImageModal({ locale = "en" }) {
  const t = getCopy(locale);

  useEffect(() => {
    const modal = document.querySelector("#image-modal");
    const modalImage = document.querySelector("#modal-image");
    const modalTitle = document.querySelector("#modal-title");
    const modalCaption = document.querySelector("#modal-caption");

    if (!modal || !modalImage || !modalTitle || !modalCaption) {
      return;
    }

    let lastTrigger = null;

    const closeModal = () => {
      modal.hidden = true;
      document.body.classList.remove("modal-open");
      modalImage.removeAttribute("src");
      if (lastTrigger) {
        lastTrigger.focus();
      }
    };

    const modalCleanups = [...document.querySelectorAll("[data-modal-image]")].map((link) => {
      const onClick = (event) => {
        event.preventDefault();
        lastTrigger = link;
        modalImage.src = link.href;
        modalImage.alt = link.querySelector("img")?.alt ?? "";
        modalTitle.textContent = link.dataset.title ?? "";
        modalCaption.textContent = link.dataset.caption ?? "";
        modal.hidden = false;
        document.body.classList.add("modal-open");
        modal.querySelector(".modal-close")?.focus();
      };
      link.addEventListener("click", onClick);
      return () => link.removeEventListener("click", onClick);
    });

    const closeCleanups = [...document.querySelectorAll("[data-modal-close]")].map((button) => {
      button.addEventListener("click", closeModal);
      return () => button.removeEventListener("click", closeModal);
    });

    const onKeydown = (event) => {
      if (event.key === "Escape" && !modal.hidden) {
        closeModal();
      }
    };
    document.addEventListener("keydown", onKeydown);

    return () => {
      document.removeEventListener("keydown", onKeydown);
      for (const cleanup of [...modalCleanups, ...closeCleanups]) {
        cleanup();
      }
    };
  }, []);

  return (
    <div className="image-modal" id="image-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" hidden>
      <button className="modal-backdrop" type="button" data-modal-close aria-label={t.closePreview} />
      <div className="modal-panel">
        <button className="modal-close" type="button" data-modal-close>
          {t.close}
        </button>
        <figure className="modal-figure">
          <img id="modal-image" alt="" />
          <figcaption>
            <strong id="modal-title" />
            <span id="modal-caption" />
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
