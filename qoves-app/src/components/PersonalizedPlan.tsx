'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import MotionBorder from './MotionBorder';
import styles from './PersonalizedPlan.module.scss';

gsap.registerPlugin(useGSAP);

/* ── Step card data ── */
const steps = [
  { id: 1, text: 'Get your expert facial analysis' },
  { id: 2, text: 'Visualise your best-looking self' },
  { id: 3, text: 'Get your personalized glow-up protocol' },
  { id: 4, text: 'Track your progress and see dramatic results' },
] as const;

/* ── Connector Arrow SVG ── */
const ConnectorArrow: React.FC = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const arrowRef = useRef<SVGPolygonElement>(null);
  const containerRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (!pathRef.current || !arrowRef.current) return;

      const path = pathRef.current;
      const totalLength = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: totalLength,
        strokeDashoffset: totalLength,
      });
      gsap.set(arrowRef.current, { opacity: 0 });

      const tl = gsap.timeline();
      tl.to(path, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: 'power2.inOut',
      }).to(
        arrowRef.current,
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power1.in',
        },
        '-=0.2'
      );
    },
    { scope: containerRef }
  );

  return (
    <svg
      ref={containerRef}
      className={styles.connectorSvg}
      viewBox="0 0 160 200"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      // Decorative illustration — hidden from assistive technology
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d="M 10,60 C 40,60 50,140 80,140 C 110,140 120,60 150,60"
        stroke="#C8D3D8"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <polygon
        ref={arrowRef}
        points="145,54 155,60 145,66"
        fill="#C8D3D8"
      />
    </svg>
  );
};

/* ── Main Component ── */
const PersonalizedPlan: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState<number>(2);

  return (
    <section className={styles.section} aria-label="Get your personalised Qoves plan">
      {/* ── Header ── */}
      <header className={styles.header}>
        <span className={styles.pill}>PERSONALISED ANALYSIS</span>
        <h2 className={styles.heading}>
          Get your personalised{' '}
          <span className={styles.headingAccent}>Qoves</span> plan
        </h2>
        <p className={styles.subheading}>
          Understand your facial features and start your glow-up today with a
          proven action plan, no plastic surgery needed.
        </p>
      </header>

      {/* ── Before / After Display ── */}
      <div className={styles.displayArea}>
        {/*
          MotionBorder SVG overlay — sits at absolute inset:0 of displayArea.
          CRITICAL SYNC: imageFraction & gapFraction MUST match the CSS grid:
            grid-template-columns: 30% 40% 30%
        */}
        <MotionBorder
          borderRadius={18}       /* matches .imageContainer border-radius */
          dotColor="#A3B8C4"
          dotSize={6}
          duration={12}
          trackColor="#D5DDE1"
          trackWidth={1.5}
          borderPadding={10}
          bridgeGap={30}
          imageFraction={0.30}    /* matches grid column 1 & 3: 30% */
          gapFraction={0.40}      /* matches grid column 2: 40% */
        />

        {/* BEFORE */}
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper}>
            <span className={styles.imageLabel} aria-hidden="true">BEFORE</span>
            <img src="/assets/before.webp" alt="Before facial analysis" />
          </div>
          <div className={styles.handleBefore} aria-hidden="true" />
        </div>

        {/* AFTER */}
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper}>
            <span className={styles.imageLabel} aria-hidden="true">AFTER</span>
            <img src="/assets/after.webp" alt="After facial analysis" />
          </div>
          <div className={styles.handleAfter} aria-hidden="true" />
        </div>
      </div>

      {/* ── Bottom Step Cards ── */}
      <ol className={styles.bottomGrid} aria-label="Steps to get your plan">
        {steps.map((step) => (
          <li
            key={step.id}
            className={`${styles.card} ${activeStepId === step.id ? styles.active : ''}`}
            onMouseEnter={() => setActiveStepId(step.id)}
            onFocus={() => setActiveStepId(step.id)}
            tabIndex={0}
            aria-current={activeStepId === step.id ? 'step' : undefined}
          >
            <div className={styles.badge} aria-hidden="true">{step.id}</div>
            <p className={styles.cardText}>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default PersonalizedPlan;
