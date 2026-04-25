"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getCopy } from "../lib/i18n";

const SESSION_KEY = "gptimg2:lucky-session:v1";
const SESSION_TTL_MS = 15 * 60 * 1000;
const SESSION_TTL_MINUTES = Math.round(SESSION_TTL_MS / 60000);
const DRAW_EXIT_MS = 140;
const DRAW_ENTER_MS = 420;
const IMAGE_SIZES = "(max-width: 760px) calc(100vw - 20px), (max-width: 1100px) calc(100vw - 52px), calc(100vw - 460px)";

const randomIndex = (length) => {
  if (length <= 1) return 0;

  if (globalThis.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    const max = 0xffffffff;
    const bucket = Math.floor(max / length) * length;

    do {
      globalThis.crypto.getRandomValues(values);
    } while (values[0] >= bucket);

    return values[0] % length;
  }

  return Math.floor(Math.random() * length);
};

const getSessionStorage = () => {
  try {
    const storage = globalThis.sessionStorage;
    const probe = `${SESSION_KEY}:probe`;
    storage.setItem(probe, "1");
    storage.removeItem(probe);
    return storage;
  } catch {
    return null;
  }
};

const readSession = (validIds, now) => {
  const storage = getSessionStorage();
  if (!storage) return { history: [], lastId: "", storage: null, storageAvailable: false };

  try {
    const parsed = JSON.parse(storage.getItem(SESSION_KEY) ?? "{}");
    if (!Array.isArray(parsed.history) || Number(parsed.expiresAt) <= now) {
      storage.removeItem(SESSION_KEY);
      return { history: [], lastId: "", storage, storageAvailable: true };
    }

    return {
      history: parsed.history.filter((id) => validIds.has(id)),
      lastId: validIds.has(parsed.lastId) ? parsed.lastId : "",
      storage,
      storageAvailable: true,
    };
  } catch {
    storage.removeItem(SESSION_KEY);
    return { history: [], lastId: "", storage, storageAvailable: true };
  }
};

const writeSession = (storage, history, lastId, now) => {
  if (!storage) return null;

  const expiresAt = now + SESSION_TTL_MS;
  try {
    storage.setItem(SESSION_KEY, JSON.stringify({ history, lastId, expiresAt }));
    return expiresAt;
  } catch {
    return null;
  }
};

const prefersReducedMotion = () => globalThis.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

export default function LuckyDraw({ entries, locale = "en" }) {
  const t = getCopy(locale);
  const [entry, setEntry] = useState(null);
  const [motionPhase, setMotionPhase] = useState("idle");
  const [sessionInfo, setSessionInfo] = useState({
    reset: false,
    seen: 0,
    storageAvailable: true,
    total: entries.length,
  });
  const currentIdRef = useRef(null);
  const drewInitialRef = useRef(false);
  const timersRef = useRef([]);

  const entriesById = useMemo(() => new Map(entries.map((item) => [item.id, item])), [entries]);
  const validIds = useMemo(() => new Set(entries.map((item) => item.id)), [entries]);

  const drawNext = useCallback(() => {
    if (entries.length === 0) return;

    const now = Date.now();
    const session = readSession(validIds, now);
    const previousId = currentIdRef.current ?? session.lastId;
    const previousKey = entriesById.get(previousId)?.dedupeKey;
    const seenIds = new Set(session.history);
    const seenKeys = new Set(session.history.map((id) => entriesById.get(id)?.dedupeKey).filter(Boolean));
    let pool = entries.filter((item) => !seenIds.has(item.id));
    let reset = false;

    const diversePool = pool.filter((item) => !seenKeys.has(item.dedupeKey));
    if (diversePool.length > 0) {
      pool = diversePool;
    }

    if (pool.length === 0) {
      reset = true;
      pool = entries.filter((item) => item.id !== previousId && item.dedupeKey !== previousKey);
      if (pool.length === 0) {
        pool = entries.filter((item) => item.id !== previousId);
      }
      if (pool.length === 0) {
        pool = entries;
      }
    }

    const selected = pool[randomIndex(pool.length)];
    const nextHistory = reset ? [selected.id] : [...session.history, selected.id];
    const expiresAt = writeSession(session.storage, nextHistory, selected.id, now);

    const commitSelection = () => {
      currentIdRef.current = selected.id;
      setEntry(selected);
      setSessionInfo({
        reset,
        seen: nextHistory.length,
        storageAvailable: session.storageAvailable && expiresAt !== null,
        total: entries.length,
      });
    };

    for (const timer of timersRef.current) {
      clearTimeout(timer);
    }
    timersRef.current = [];

    if (entry && !prefersReducedMotion()) {
      setMotionPhase("exiting");
      timersRef.current.push(
        setTimeout(() => {
          commitSelection();
          setMotionPhase("entering");
          timersRef.current.push(setTimeout(() => setMotionPhase("idle"), DRAW_ENTER_MS));
        }, DRAW_EXIT_MS),
      );
      return;
    }

    commitSelection();
    setMotionPhase("entering");
    timersRef.current.push(setTimeout(() => setMotionPhase("idle"), DRAW_ENTER_MS));
  }, [entries, entriesById, entry, validIds]);

  const resetSession = useCallback(() => {
    getSessionStorage()?.removeItem(SESSION_KEY);
    currentIdRef.current = null;
    drawNext();
  }, [drawNext]);

  useEffect(() => {
    if (drewInitialRef.current) return;
    drewInitialRef.current = true;
    drawNext();
  }, [drawNext]);

  useEffect(
    () => () => {
      for (const timer of timersRef.current) {
        clearTimeout(timer);
      }
    },
    [],
  );

  if (entries.length === 0) {
    return <p className="panel">{t.luckyEmpty}</p>;
  }

  if (!entry) {
    return <p className="panel">{t.luckyLoading}</p>;
  }

  const progress = Math.max(0, Math.min(100, (sessionInfo.seen / sessionInfo.total) * 100));
  const isDrawing = motionPhase !== "idle";

  return (
    <section className={`lucky-draw is-${motionPhase}`} aria-live="polite" aria-busy={isDrawing ? "true" : undefined}>
      <article className="lucky-stage">
        <div className="lucky-screen" key={entry.id}>
          <a
            className="lucky-image-link"
            href={entry.imageUrl}
            data-modal-image
            data-title={entry.title}
            data-caption={entry.caption}
            aria-label={t.openPreview(entry.title)}
          >
            <Image
              src={entry.thumbnailUrl}
              alt={t.cardAlt(entry.title, entry.tags.map((tag) => tag.label))}
              width={entry.thumbnailWidth}
              height={entry.thumbnailHeight}
              sizes={IMAGE_SIZES}
              priority
            />
          </a>
        </div>
        <div className="lucky-card-body">
          <button className="lucky-button lucky-button-primary lucky-inline-draw" type="button" onClick={drawNext} disabled={isDrawing}>
            {t.luckyDraw}
          </button>
          <p className="eyebrow">#{String(entry.index + 1).padStart(2, "0")}</p>
          <h2>{entry.title}</h2>
          <p>{entry.caption}</p>
          <ul className="tags">
            {entry.tags.map((tag) => (
              <li key={tag.value}>{tag.href ? <a href={tag.href}>{tag.label}</a> : <span>{tag.label}</span>}</li>
            ))}
          </ul>
        </div>
      </article>

      <aside className="lucky-side panel">
        <p className="meta">{t.luckyMeta(entries.length)}</p>
        <div className="lucky-actions">
          <button className="lucky-button lucky-button-primary" type="button" onClick={drawNext} disabled={isDrawing}>
            {t.luckyDraw}
          </button>
          <button className="lucky-button lucky-button-secondary" type="button" onClick={resetSession}>
            {t.luckyReset}
          </button>
        </div>
        <div className="lucky-meter" aria-label={t.luckySessionMeta({ seen: sessionInfo.seen, total: sessionInfo.total, minutes: SESSION_TTL_MINUTES })}>
          <span>{t.luckySessionMeta({ seen: sessionInfo.seen, total: sessionInfo.total, minutes: SESSION_TTL_MINUTES })}</span>
          <span className="lucky-meter-track">
            <span className="lucky-meter-fill" style={{ width: `${progress}%` }} />
          </span>
        </div>
        {sessionInfo.reset ? <p className="lucky-note">{t.luckyReshuffled}</p> : null}
        {!sessionInfo.storageAvailable ? <p className="lucky-note">{t.luckyStorageFallback}</p> : null}
        <div>
          <p className="meta">{t.luckyPromptPreview}</p>
          <p>{entry.promptPreview}</p>
        </div>
        <a className="button-link lucky-detail-button" href={entry.detailUrl}>
          {t.luckyOpenDetails}
        </a>
      </aside>
    </section>
  );
}
