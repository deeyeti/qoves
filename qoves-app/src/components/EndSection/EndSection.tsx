'use client';

import { useEffect, useRef } from 'react';
import EndSectionPart1 from '../EndSectionPart1';
import EndSectionPart2 from '../EndSectionPart2';
import styles from './EndSection.module.scss';

export default function EndSection() {
  const containerRef = useRef<HTMLElement | null>(null);
  const blurRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const blurEl = blurRef.current;
    if (!container || !blurEl) return;
    // Re-assign with a non-nullable type so TypeScript can reason about the closure below.
    const blur: HTMLDivElement = blurEl;

    function onScroll() {
      // Track EndSectionPart2 (the pinned scroll section)
      const part2 = container!.querySelector('[data-node-id="5:60"]');
      if (!part2) return;

      const part2Rect = part2.getBoundingClientRect();
      const vh = window.innerHeight;

      // progress 0 → Part2 just entering the bottom of the viewport
      // progress 1 → Part2's top has reached the top of the viewport
      const startY = vh;          // Part2 top is at the bottom edge
      const endY = 0;             // Part2 top is at the very top
      const progress = Math.min(Math.max((startY - part2Rect.top) / (startY - endY), 0), 1);

      // Drive the gradient mask edge from 0% (no blur visible) to 130%
      // (overshoots past 100% so the feather zone fully clears the viewport).
      const edge = progress * 130;
      const maskString = `linear-gradient(to top, black 0%, black ${edge}%, transparent ${edge + 15}%)`;
      blur.style.webkitMaskImage = maskString;
      blur.style.maskImage = maskString;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      className={styles.combinedContainer}
      ref={containerRef}
      aria-label="Questions about facial analysis"
    >
      {/* Sticky Video Background — decorative, hidden from assistive technology */}
      <div className={styles.stickyVideoWrapper} aria-hidden="true">
        <video
          className={styles.videoBackground}
          src="/assets/landing-video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className={styles.gradientFilter} />
        <div className={styles.darkBlurFilter} />
      </div>

      {/* Glassmorphic blur — sweeps upward on scroll, decorative */}
      <div className={styles.stickyBlurOverlay} aria-hidden="true">
        <div className={styles.glassmorphicBlur} ref={blurRef} />
      </div>

      {/* Scrolling Content */}
      <div className={styles.contentScroll}>
        <EndSectionPart1 />
        <EndSectionPart2 />
      </div>
    </section>
  );
}
