"use client";

import { useEffect } from "react";

export default function GalleryBehavior({ initialImageCount = 12, imageBatchSize = 12 }) {
  useEffect(() => {
    const search = document.querySelector("#search");
    const cards = [...document.querySelectorAll(".card[data-search]")];
    const tagButtons = [...document.querySelectorAll(".tag-filter")];
    const visibleCount = document.querySelector("#visible-count");
    const matchCount = document.querySelector("#match-count");
    const loadSentinel = document.querySelector("#load-sentinel");
    const loadMore = document.querySelector("#load-more");
    const modal = document.querySelector("#image-modal");
    const modalImage = document.querySelector("#modal-image");
    const modalTitle = document.querySelector("#modal-title");
    const modalCaption = document.querySelector("#modal-caption");

    if (!search || !visibleCount || !matchCount || !loadSentinel || !loadMore || !modal || !modalImage) {
      return;
    }

    let visibleLimit = initialImageCount;
    let activeTag = "";
    let autoLoadQueued = false;
    let lastTrigger = null;
    let observer = null;

    const hydrateCardImage = (card) => {
      const image = card.querySelector("img[data-src]");
      if (!image) return;

      image.src = image.dataset.src;
      image.removeAttribute("data-src");
    };

    const loadNextBatch = () => {
      if (loadSentinel.hidden) return;
      visibleLimit += imageBatchSize;
      filterCards();
    };

    function maybeAutoLoad() {
      if (loadSentinel.hidden) return;
      const triggerTop = loadSentinel.getBoundingClientRect().top;
      if (triggerTop < window.innerHeight + 900) {
        loadNextBatch();
      }
    }

    const queueAutoLoadCheck = () => {
      if (autoLoadQueued) return;
      autoLoadQueued = true;
      requestAnimationFrame(() => {
        autoLoadQueued = false;
        maybeAutoLoad();
      });
    };

    function filterCards() {
      const query = search.value.trim().toLowerCase();
      const matches = [];

      for (const card of cards) {
        const matchesSearch = !query || card.dataset.search.includes(query);
        const matchesTag = !activeTag || card.dataset.tags.split(" ").includes(activeTag);
        if (matchesSearch && matchesTag) {
          matches.push(card);
        }

        card.classList.add("is-hidden");
        card.classList.remove("is-deferred");
      }

      const visibleCards = matches.slice(0, visibleLimit);
      for (const card of visibleCards) {
        card.classList.remove("is-hidden");
        hydrateCardImage(card);
      }

      const visible = Math.min(visibleLimit, matches.length);
      visibleCount.textContent = String(visible);
      matchCount.textContent = String(matches.length);

      const remaining = matches.length - visible;
      loadSentinel.hidden = remaining <= 0;
      loadMore.textContent = remaining > 0 ? `Load ${Math.min(imageBatchSize, remaining)} more` : "Load more";
      queueAutoLoadCheck();
    }

    const resetAndFilterCards = () => {
      visibleLimit = initialImageCount;
      filterCards();
    };

    const onSearchInput = () => resetAndFilterCards();
    search.addEventListener("input", onSearchInput);

    const tagCleanups = tagButtons.map((button) => {
      const onClick = () => {
        activeTag = activeTag === button.dataset.tag ? "" : button.dataset.tag;
        for (const item of tagButtons) {
          item.classList.toggle("is-active", item.dataset.tag === activeTag);
        }
        resetAndFilterCards();
      };
      button.addEventListener("click", onClick);
      return () => button.removeEventListener("click", onClick);
    });

    loadMore.addEventListener("click", loadNextBatch);

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            loadNextBatch();
          }
        },
        { rootMargin: "900px 0px" },
      );
      observer.observe(loadSentinel);
    } else {
      loadMore.classList.add("is-fallback");
    }

    window.addEventListener("scroll", queueAutoLoadCheck, { passive: true });
    window.addEventListener("resize", queueAutoLoadCheck);

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

    filterCards();

    return () => {
      search.removeEventListener("input", onSearchInput);
      loadMore.removeEventListener("click", loadNextBatch);
      window.removeEventListener("scroll", queueAutoLoadCheck);
      window.removeEventListener("resize", queueAutoLoadCheck);
      document.removeEventListener("keydown", onKeydown);
      observer?.disconnect();
      for (const cleanup of [...tagCleanups, ...modalCleanups, ...closeCleanups]) {
        cleanup();
      }
    };
  }, [imageBatchSize, initialImageCount]);

  return null;
}
