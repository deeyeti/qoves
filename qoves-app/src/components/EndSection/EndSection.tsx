'use client';

import React, { useEffect, useRef } from 'react';
import EndSectionPart1 from '../EndSectionPart1';
import EndSectionPart2 from '../EndSectionPart2';
import styles from './EndSection.module.scss';

export default function EndSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const blurRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const blur = blurRef.current;
    if (!container || !blur) return;

    function onScroll() {
      const cardGrid = container!.querySelector('[data-card-grid]');
      if (!cardGrid) return;

      const gridRect = cardGrid.getBoundingClientRect();
      const vh = window.innerHeight;

      // progress 0 → card grid just entering the bottom of the viewport
      // progress 1 → card grid near the top (~15% from top)
      const startY = vh;
      const endY = vh * 0.15;
      const progress = Math.min(Math.max((startY - gridRect.top) / (startY - endY), 0), 1);

      // Drive the gradient mask edge from 0% (no blur visible) to 120%
      // (overshoots past 100% so the feather zone clears the top edge).
      const edge = progress * 120;
      blur!.style.setProperty('--blur-edge', `${edge}%`);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={styles.combinedContainer} ref={containerRef}>
      {/* Sticky Video Background */}
      <div className={styles.stickyVideoWrapper}>
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

      {/* Glassmorphic blur — sweeps upward on scroll */}
      <div className={styles.stickyBlurOverlay}>
        <div className={styles.glassmorphicBlur} ref={blurRef} />
      </div>

      {/* Scrolling Content */}
      <div className={styles.contentScroll}>
        <EndSectionPart1 />
        <EndSectionPart2 />
      </div>
    </div>
  );
}
