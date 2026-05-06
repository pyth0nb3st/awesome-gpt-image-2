"use client";

import { useEffect } from "react";

export default function GalleryBehavior({ initialImageCount = 12, imageBatchSize = 12, loadMoreLabel = "Load more", loadMoreCountLabel }) {
  useEffect(() => {
    const search = document.querySelector("#search");
    const gallery = document.querySelector("#gallery");
    const cards = [...document.querySelectorAll(".card[data-search]")];
    const tagButtons = [...document.querySelectorAll(".tag-filter")];
    const visibleCount = document.querySelector("#visible-count");
    const matchCount = document.querySelector("#match-count");
    const loadSentinel = document.querySelector("#load-sentinel");
    const loadMore = document.querySelector("#load-more");

    if (!search || !gallery || !visibleCount || !matchCount || !loadSentinel || !loadMore) {
      return;
    }

    let visibleLimit = initialImageCount;
    let activeTag = "";
    let autoLoadQueued = false;
    let masonryColumnCount = 0;
    let masonryColumns = [];
    let observer = null;
    const backToTop = document.createElement("button");
    backToTop.className = "back-to-top";
    backToTop.type = "button";
    backToTop.setAttribute("aria-label", "Back to top");
    backToTop.title = "Back to top";
    backToTop.textContent = "↑";
    document.body.append(backToTop);
    const cardPool = document.createElement("div");
    cardPool.className = "masonry-pool";
    cardPool.hidden = true;
    gallery.after(cardPool);

    const masonryColumnTarget = () => {
      if (window.matchMedia("(max-width: 680px)").matches) return 1;
      if (window.matchMedia("(max-width: 980px)").matches) return 2;
      return 3;
    };

    const ensureMasonryColumns = () => {
      const nextColumnCount = masonryColumnTarget();
      if (nextColumnCount === masonryColumnCount && masonryColumns.length) {
        return;
      }

      for (const card of cards) {
        cardPool.append(card);
        card.style.removeProperty("transform");
        card.style.removeProperty("width");
      }

      masonryColumnCount = nextColumnCount;
      masonryColumns = Array.from({ length: masonryColumnCount }, () => {
        const column = document.createElement("div");
        column.className = "masonry-column";
        return column;
      });
      gallery.replaceChildren(...masonryColumns);
      gallery.style.removeProperty("height");
      gallery.style.removeProperty("--masonry-columns");
    };

    const layoutMasonry = (visibleCards) => {
      ensureMasonryColumns();
      const columnHeights = masonryColumns.map(() => 0);

      for (const column of masonryColumns) {
        column.replaceChildren();
      }

      for (const card of visibleCards) {
        let targetIndex = 0;
        for (let index = 1; index < columnHeights.length; index += 1) {
          if (columnHeights[index] < columnHeights[targetIndex]) {
            targetIndex = index;
          }
        }

        masonryColumns[targetIndex].append(card);
        const image = card.querySelector("img");
        const imageWidth = Number(image?.getAttribute("width")) || 1;
        const imageHeight = Number(image?.getAttribute("height")) || 1;
        columnHeights[targetIndex] += imageHeight / imageWidth;
      }
    };

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
        backToTop.classList.toggle("is-visible", window.scrollY > 720);
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

      layoutMasonry(visibleCards);

      const visible = Math.min(visibleLimit, matches.length);
      visibleCount.textContent = String(visible);
      matchCount.textContent = String(matches.length);

      const remaining = matches.length - visible;
      loadSentinel.hidden = remaining <= 0;
      loadMore.textContent =
        remaining > 0
          ? loadMoreCountLabel?.replace("{count}", String(Math.min(imageBatchSize, remaining))) ?? `Load ${Math.min(imageBatchSize, remaining)} more`
          : loadMoreLabel;

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
    const onBackToTopClick = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    backToTop.addEventListener("click", onBackToTopClick);

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
    const onResize = () => {
      masonryColumnCount = 0;
      filterCards();
      queueAutoLoadCheck();
    };
    window.addEventListener("resize", onResize);

    filterCards();

    return () => {
      search.removeEventListener("input", onSearchInput);
      loadMore.removeEventListener("click", loadNextBatch);
      backToTop.removeEventListener("click", onBackToTopClick);
      window.removeEventListener("scroll", queueAutoLoadCheck);
      window.removeEventListener("resize", onResize);
      observer?.disconnect();
      gallery.style.removeProperty("height");
      gallery.style.removeProperty("--masonry-columns");
      for (const card of cards) {
        card.style.removeProperty("transform");
        card.style.removeProperty("width");
        gallery.append(card);
      }
      cardPool.remove();
      backToTop.remove();
      for (const cleanup of tagCleanups) {
        cleanup();
      }
    };
  }, [imageBatchSize, initialImageCount, loadMoreCountLabel, loadMoreLabel]);

  return null;
}
