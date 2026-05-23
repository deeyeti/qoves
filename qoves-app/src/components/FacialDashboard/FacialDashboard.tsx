'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from 'recharts';
import { DashboardGrid } from './DashboardGrid';
import { DensityChartCard } from './DensityChartCard';
import { TiltCard } from './TiltCard';
import { eyePalette, facialThirds } from './data';
import styles from './FacialDashboard.module.scss';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ── Helpers ── */

function getNorm(e: React.MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  return {
    nx: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
    ny: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
  };
}

/* ── Eyebrow Matrix Card ── */

const MATRIX_DEFAULT = { row: 3, col: 6 };

const MATRIX_HOVER = { row: 1, col: 8 };

function EyebrowMatrixCard() {
  const [hot, setHot] = useState(MATRIX_DEFAULT);

  const onMouseEnter = useCallback(() => setHot(MATRIX_HOVER), []);
  const onMouseLeave = useCallback(() => setHot(MATRIX_DEFAULT), []);

  return (
    <TiltCard
      className={styles.matrixCard}
      depth={18}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`${styles.matrixCopy} ${styles.matrixTop}`}>Bold</div>
      <div className={`${styles.matrixCopy} ${styles.matrixLeft}`}>Feminine</div>
      <div className={`${styles.matrixCopy} ${styles.matrixRight}`}>Masculine</div>
      <div className={`${styles.matrixCopy} ${styles.matrixBottom}`}>Subtle</div>
      <div className={styles.matrix}>
        {Array.from({ length: 100 }, (_, i) => {
          const row = Math.floor(i / 10);
          const col = i % 10;
          const dist = Math.hypot(row - hot.row, col - hot.col);
          const isHot = dist < 1.6;
          const isWarm = dist < 3.2;
          return (
            <span
              key={i}
              className={isHot ? styles.hot : isWarm ? styles.warm : ''}
              style={{ transition: 'background 0.15s ease' }}
            />
          );
        })}
      </div>
      <div className={`${styles.crosshair} ${styles.crosshairX}`} />
      <div className={`${styles.crosshair} ${styles.crosshairY}`} />
      <p className={styles.badge}>Brows fall in the top 20% for natural fullness.</p>
    </TiltCard>
  );
}

/* ── Lip Smoothness Card ── */

const LIP_DEFAULT = 56;
const LIP_HOVER = 88;

function LipSmoothnessCard() {
  const [value, setValue] = useState(LIP_DEFAULT);
  const barRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLElement>(null);
  const animVal = useRef({ v: LIP_DEFAULT });

  useGSAP(() => {
    gsap.to(animVal.current, {
      v: value,
      duration: 0.25,
      ease: 'power2.out',
      onUpdate() {
        const pct = Math.round(animVal.current.v);
        if (barRef.current) barRef.current.style.width = `${pct}%`;
        if (markerRef.current) markerRef.current.style.left = `${pct}%`;
        if (labelRef.current) labelRef.current.textContent = `${pct}%`;
      },
    });
  }, { dependencies: [value] });

  const onMouseEnter = useCallback(() => setValue(LIP_HOVER), []);
  const onMouseLeave = useCallback(() => setValue(LIP_DEFAULT), []);

  return (
    <TiltCard
      className={styles.lipCard}
      depth={12}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div>
        <p className={styles.microLabel}>Lip smoothness</p>
        <strong
          ref={labelRef as unknown as React.RefObject<HTMLElement>}
          style={{ color: '#f8f8f8', fontSize: 24, fontWeight: 400, lineHeight: '28px' }}
        >
          {LIP_DEFAULT}%
        </strong>
      </div>
      <div className={styles.meterArea}>
        <span>Rough (0%)</span>
        <div className={styles.meter}>
          <i ref={barRef as unknown as React.RefObject<HTMLElement>} style={{ width: `${LIP_DEFAULT}%` }} />
          <b ref={markerRef as unknown as React.RefObject<HTMLElement>} style={{ left: `${LIP_DEFAULT}%` }} />
        </div>
        <span>Smooth (100%)</span>
      </div>
    </TiltCard>
  );
}

/* ── Eye Melanin Card ── */

const melaninLabels = [
  'Deep blue', 'Ice blue', 'Ocean blue', 'Forest green',
  'Hazel green', 'Amber', 'Honey brown', 'Medium brown',
  'Dark brown', 'Deep brown', 'Ebony', 'Jet black',
  'Warm black', 'Cool black', 'Pure black',
];
const MELANIN_DEFAULT_TOP = 148;
const MELANIN_DEFAULT_LABEL = 'Dark brown';
const MELANIN_DEFAULT_BADGE = 'Your eyes have a medium melanin concentration.';

function EyeMelaninCard() {
  const lineRef = useRef<HTMLSpanElement>(null);
  const tagLRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLParagraphElement>(null);

  const onMouseEnter = useCallback(() => {
    // Preset: index 4 (Hazel green)
    // ny = 4 / 15 = 0.267
    // stripY = 0.267 * 222 = 59
    const stripY = 59;
    if (lineRef.current) gsap.to(lineRef.current, { top: 12 + stripY, duration: 0.35, ease: 'power2.out' });
    if (tagLRef.current) {
      gsap.to(tagLRef.current, { top: 8 + stripY, duration: 0.35, ease: 'power2.out' });
      tagLRef.current.textContent = 'Hazel green';
    }
    if (badgeRef.current) {
      badgeRef.current.textContent = 'Your eyes have a low melanin concentration.';
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    if (lineRef.current) gsap.to(lineRef.current, { top: MELANIN_DEFAULT_TOP, duration: 0.4, ease: 'power3.out' });
    if (tagLRef.current) {
      gsap.to(tagLRef.current, { top: 144, duration: 0.4, ease: 'power3.out' });
      tagLRef.current.textContent = MELANIN_DEFAULT_LABEL;
    }
    if (badgeRef.current) badgeRef.current.textContent = MELANIN_DEFAULT_BADGE;
  }, []);

  return (
    <TiltCard
      className={styles.eyeCard}
      depth={14}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.eyeScale}>
        <div className={`${styles.eyeLabel} ${styles.eyeTop}`}>Blue</div>
        <div className={`${styles.eyeLabel} ${styles.eyeMiddle}`}>Green</div>
        <div className={`${styles.eyeLabel} ${styles.eyeLower}`}>Brown</div>
        <div className={`${styles.eyeLabel} ${styles.eyeBottom}`}>Deep</div>
        <div className={styles.paletteStrip}>
          {eyePalette.map((color) => (
            <span key={color} style={{ backgroundColor: color }} />
          ))}
        </div>
        <span className={styles.melaninLine} ref={lineRef} />
        <span className={`${styles.tag} ${styles.tagLeft}`} ref={tagLRef}>{MELANIN_DEFAULT_LABEL}</span>
        <span className={`${styles.tag} ${styles.tagRight}`}>You</span>
      </div>
      <p className={styles.badge} ref={badgeRef}>{MELANIN_DEFAULT_BADGE}</p>
    </TiltCard>
  );
}

/* ── Facial Thirds Card ── */

function ThirdsCard() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const onMouseEnter = useCallback(() => setActiveIdx(1), []); // Preset to Middle third
  const onMouseLeave = useCallback(() => setActiveIdx(null), []);

  return (
    <TiltCard
      className={styles.thirdsCard}
      depth={10}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <p className={styles.microLabel}>Facial thirds</p>
      <div className={styles.thirdsBars}>
        {facialThirds.map((third, i) => (
          <div
            className={styles.third}
            key={i}
            style={{
              opacity: activeIdx === null || activeIdx === i ? 1 : 0.35,
              transition: 'opacity 0.18s ease',
            }}
          >
            <span>{third.label}</span>
            <i style={{ width: `${third.width}%` }} />
            <strong>{third.value}</strong>
          </div>
        ))}
      </div>
    </TiltCard>
  );
}

/* ── Symmetry Card ── */

const SYM_DEFAULT = { youY: 62, avgY: 41 };
const SYM_HOVER = { youY: 82, avgY: 55 };

function SymmetryCard() {
  const [lines, setLines] = useState(SYM_DEFAULT);

  const onMouseEnter = useCallback(() => setLines(SYM_HOVER), []);
  const onMouseLeave = useCallback(() => setLines(SYM_DEFAULT), []);

  const idealData = [{ x: 9, y: 78 }, { x: 93, y: 78 }];
  const youData = [{ x: 9, y: lines.youY }, { x: 93, y: lines.youY }];
  const averageData = [{ x: 9, y: lines.avgY }, { x: 93, y: lines.avgY }];

  return (
    <TiltCard
      className={styles.symmetryCard}
      depth={10}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 8, right: 16, bottom: 22, left: 10 }}>
          <CartesianGrid stroke="rgba(242,242,242,0.14)" strokeDasharray="3 4" />
          <XAxis dataKey="x" hide domain={[0, 100]} type="number" />
          <YAxis hide domain={[0, 100]} type="number" />
          <Scatter data={idealData} fill="transparent" line={{ stroke: '#e8f4f6', strokeWidth: 2 }} lineType="joint" name="Ideal" shape={() => <g />} isAnimationActive={false} />
          <Scatter data={youData} fill="transparent" line={{ stroke: '#b6d7dd', strokeWidth: 2 }} lineType="joint" name="You" shape={() => <g />} isAnimationActive={false} />
          <Scatter data={averageData} fill="transparent" line={{ stroke: '#8fb0b8', strokeWidth: 1.6 }} lineType="joint" name="Average" shape={() => <g />} isAnimationActive={false} />
        </ScatterChart>
      </ResponsiveContainer>
      <span className={`${styles.tag} ${styles.symmetryIdeal}`}>Ideal</span>
      <span className={`${styles.tag} ${styles.symmetryYou}`}>You</span>
      <span className={`${styles.tag} ${styles.symmetryAverage}`}>Average</span>
      <div className={styles.symmetryAxis}>
        <span>Asymmetrical</span>
        <span>Symmetrical</span>
      </div>
    </TiltCard>
  );
}

export default function FacialDashboard() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        // For small mobile screens, scale a base stage width of 600px to fit the device viewport perfectly
        const targetWidth = 600;
        const availableWidth = w - 16; // 8px lateral padding
        setScale(Math.min(1, availableWidth / targetWidth));
      } else {
        setScale(1);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const imageWrap = section.querySelector(`.${styles.centreImageWrap}`);
      if (!imageWrap) return;

      gsap.set('[data-fd-reveal]', { autoAlpha: 0, y: 18 });
      gsap.set('[data-tilt-card]', { autoAlpha: 0, filter: 'blur(8px)', scale: 0.94, y: 34 });
      gsap.set(`.${styles.matrix} span, .${styles.paletteStrip} span`, { autoAlpha: 0, scale: 0.65 });
      gsap.set(`.${styles.badge}, .${styles.tag}`, { autoAlpha: 0, y: 8 });
      gsap.set(`.${styles.meter} i, .${styles.third} i`, { scaleX: 0, transformOrigin: 'left center' });

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%', // Stagger reveals trigger exactly when the section enters 75% of the viewport
          once: true,
        },
        defaults: { ease: 'power3.out' }
      })
        .to('[data-fd-reveal]', { autoAlpha: 1, duration: 0.8, stagger: 0.12, y: 0 })
        .to('[data-tilt-card]', { autoAlpha: 1, duration: 0.95, filter: 'blur(0px)', scale: 1, stagger: { amount: 0.55, from: 'center' }, y: 0 }, '-=0.25')
        .to(`.${styles.matrix} span`, { autoAlpha: 1, duration: 0.42, scale: 1, stagger: { amount: 0.55, grid: [10, 10], from: 'center' } }, '-=0.55')
        .to(`.${styles.paletteStrip} span`, { autoAlpha: 1, duration: 0.28, scale: 1, stagger: 0.025 }, '-=0.55')
        .to(`.${styles.meter} i, .${styles.third} i`, { duration: 0.82, scaleX: 1, stagger: 0.08 }, '-=0.35')
        .to(`.${styles.badge}, .${styles.tag}`, { autoAlpha: 1, duration: 0.42, stagger: 0.05, y: 0 }, '-=0.35');

      gsap.to(imageWrap, {
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2, // Liquid-smooth scrolling catch-up interpolation
        },
        scale: 1.20,
        y: -120, // Negative y translate creates a beautiful upward parallax float on scroll down!
        transformOrigin: 'center center',
        ease: 'none',
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      aria-label="Facial analysis dashboard"
      className={styles.section}
      ref={sectionRef}
    >
      <div className={styles.glowBlob1} aria-hidden="true" />
      <div className={styles.glowBlob2} aria-hidden="true" />
      <div className={styles.glassBackground} aria-hidden="true" />
      <div className={styles.edgeBlurLeft} aria-hidden="true" />
      <div className={styles.edgeBlurRight} aria-hidden="true" />
      <div className={styles.outerFrame}>
        <header className={styles.header}>
          <div className={styles.cardHeader}>
            <p className={styles.eyebrow} data-fd-reveal>Personalized aesthetics</p>
            <h2 data-fd-reveal>Your complete <span>facial analysis</span></h2>
            <p data-fd-reveal>
              Every face is unique. We assess more than 100 unique facial markers to give you a
              precise understanding of your aesthetics.
            </p>
          </div>
        </header>

        <div className={styles.cardContainer} style={{ height: scale !== 1 ? `${580 * scale}px` : undefined }}>
          <div
            className={styles.stage}
            style={{
              transform: scale !== 1 ? `scale(${scale})` : undefined,
              transformOrigin: 'top center',
            }}
          >
            <DashboardGrid>
              <div ref={imageWrapRef} className={styles.centreImageWrap}>
                <Image
                  src="/assets/section 2 lady.png"
                  alt="Facial Analysis Portrait"
                  fill
                  sizes="620px"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>

              <div className={styles.leftStack}>
                <EyebrowMatrixCard />
                <div className={styles.midStack}>
                  <TiltCard className={styles.chartCard} depth={12}>
                    <DensityChartCard />
                  </TiltCard>
                  <LipSmoothnessCard />
                </div>
              </div>

              <div className={styles.rightStack}>
                <EyeMelaninCard />
                <div className={styles.rightColumn}>
                  <ThirdsCard />
                  <SymmetryCard />
                </div>
              </div>
            </DashboardGrid>
          </div>
        </div>
      </div>
    </section>
  );
}
