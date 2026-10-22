import { useState, useEffect, useRef } from 'react';
import quotesData from '../data/quotes.json';
import './QuoteLoader.css';

/**
 * Fisher-Yates (Knuth) Shuffle algorithm.
 * Returns a new shuffled copy of the input array.
 */
function fisherYatesShuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Category badge metadata & styling classes.
 */
const CATEGORY_MAP = {
  discipline: {
    label: 'Discipline',
    className: 'quote-category-discipline',
  },
  motivation: {
    label: 'Motivation',
    className: 'quote-category-motivation',
  },
  consistency: {
    label: 'Consistency',
    className: 'quote-category-consistency',
  },
  fitness: {
    label: 'Fitness',
    className: 'quote-category-fitness',
  },
};

/**
 * QuoteLoader component
 *
 * Displays rotating motivational quotes while MongoDB / API data is loading.
 * Shuffles quotes on mount via Fisher-Yates, never repeats until all 100 quotes
 * are displayed, and never shows the same quote twice in a row.
 * Displays quotes instantly on mount with zero delay.
 *
 * @param {boolean} fullScreen - Whether to render full-screen (e.g. for ProtectedRoute)
 * @param {string} className - Additional CSS classes
 * @param {string} statusText - Subtle loading status indicator text
 */
export default function QuoteLoader({
  fullScreen = false,
  className = '',
  statusText = 'Loading your fitness data...',
}) {
  // Synchronously initialize the shuffled deck on component creation
  // so the first quote renders INSTANTLY on the initial frame.
  const deckRef = useRef(null);
  const indexRef = useRef(0);

  if (!deckRef.current) {
    deckRef.current = fisherYatesShuffle(quotesData);
  }

  // Active quote & animation state
  const [currentQuote, setCurrentQuote] = useState(() => deckRef.current[0]);
  const [animatingOut, setAnimatingOut] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    const ROTATION_INTERVAL = 3500; // 3.5s per quote
    const FADE_OUT_DURATION = 250; // smooth exit before entering next quote

    let fadeTimeoutId;

    const intervalId = setInterval(() => {
      // 1. Trigger exit animation
      setAnimatingOut(true);

      fadeTimeoutId = setTimeout(() => {
        // 2. Increment pointer
        indexRef.current += 1;

        // When all quotes have been shown, reshuffle without repeating the last quote
        if (indexRef.current >= deckRef.current.length) {
          const lastQuoteId = deckRef.current[deckRef.current.length - 1]?.id;
          let newDeck = fisherYatesShuffle(quotesData);

          // Guarantee the first quote of the new cycle differs from the last shown
          if (newDeck.length > 1 && newDeck[0]?.id === lastQuoteId) {
            const swapIdx = 1 + Math.floor(Math.random() * (newDeck.length - 1));
            [newDeck[0], newDeck[swapIdx]] = [newDeck[swapIdx], newDeck[0]];
          }

          deckRef.current = newDeck;
          indexRef.current = 0;
        }

        const nextQuote = deckRef.current[indexRef.current];
        setCurrentQuote(nextQuote);
        setAnimatingOut(false);
        setProgressKey((prev) => prev + 1);
      }, FADE_OUT_DURATION);
    }, ROTATION_INTERVAL);

    // Clean up all active timers on unmount
    return () => {
      clearInterval(intervalId);
      clearTimeout(fadeTimeoutId);
    };
  }, []);

  const categoryMeta =
    CATEGORY_MAP[currentQuote?.category?.toLowerCase()] || {
      label: currentQuote?.category || 'Fitness',
      className: 'quote-category-fitness',
    };

  const wrapperClass = fullScreen
    ? `quote-loader-fullscreen-wrap ${className}`
    : `quote-loader-inline-wrap ${className}`;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading content"
      className={wrapperClass}
    >
      {/* Subtle background glow effect */}
      <div className="quote-loader-glow" aria-hidden="true" />

      {/* Main Quote Card */}
      <div className="quote-loader-card">
        {/* Category Pill Badge */}
        <div className={`quote-category-badge ${categoryMeta.className}`}>
          <span className="quote-category-dot" aria-hidden="true" />
          <span>{categoryMeta.label}</span>
        </div>

        {/* Decorative Opening Quotation Mark */}
        <div className="quote-decor-mark" aria-hidden="true">
          <svg
            className="quote-decor-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        {/* Quote text with smooth slide-up + fade transition */}
        <div className="quote-text-container">
          <p
            id="quote-loader-text"
            className={`quote-text ${
              animatingOut ? 'quote-state-exiting' : 'quote-state-entering'
            }`}
          >
            &ldquo;{currentQuote?.text}&rdquo;
          </p>
        </div>

        {/* Slim animated progress bar tracking the 3.5s quote rotation */}
        <div className="quote-progress-track" aria-hidden="true">
          <div key={progressKey} className="quote-progress-bar" />
        </div>

        {/* Status indicator row with pulsing dots */}
        <div className="quote-status-row" aria-hidden="true">
          <div className="quote-dots-group">
            <span className="quote-pulse-dot" />
            <span className="quote-pulse-dot" />
            <span className="quote-pulse-dot" />
          </div>
          <span>{statusText}</span>
        </div>
      </div>
    </div>
  );
}
