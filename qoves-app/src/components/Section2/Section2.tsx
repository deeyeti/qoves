'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from 'recharts';
import styles from './Section2.module.scss';

const bellCurveData = [
  { x: 0, y: 7 },
  { x: 12, y: 16 },
  { x: 24, y: 38 },
  { x: 36, y: 71 },
  { x: 48, y: 96 },
  { x: 60, y: 82 },
  { x: 72, y: 49 },
  { x: 84, y: 24 },
  { x: 96, y: 10 },
];

const scatterData = [
  { x: 11, y: 78 },
  { x: 18, y: 58 },
  { x: 25, y: 68 },
  { x: 34, y: 42 },
  { x: 42, y: 73 },
  { x: 49, y: 31 },
  { x: 57, y: 62 },
  { x: 63, y: 48 },
  { x: 71, y: 81 },
  { x: 78, y: 36 },
  { x: 86, y: 59 },
];

const toneData = [
  { name: 'A', value: 34 },
  { name: 'B', value: 50 },
  { name: 'C', value: 42 },
  { name: 'D', value: 68 },
  { name: 'E', value: 56 },
  { name: 'F', value: 48 },
  { name: 'G', value: 61 },
];

const featureBars = [
  { label: 'Upper third', value: 74 },
  { label: 'Midface', value: 72 },
  { label: 'Lower third', value: 53 },
];

function BellCurveCard() {
  return (
    <article className={`${styles.chartCard} ${styles.bellCard}`} data-reveal>
      <div className={styles.cardTopline}>
        <span>Feature profile</span>
        <strong>Eye lift effect</strong>
      </div>
      <div className={styles.chartCanvas}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={bellCurveData} margin={{ top: 10, right: 8, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id="section2BellFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#f4f7f5" stopOpacity={0.86} />
                <stop offset="100%" stopColor="#f4f7f5" stopOpacity={0.08} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.12)" vertical horizontal={false} />
            <XAxis dataKey="x" axisLine={false} tickLine={false} hide />
            <YAxis axisLine={false} tickLine={false} hide />
            <Area
              dataKey="y"
              type="monotone"
              stroke="#f4f7f5"
              strokeWidth={1.8}
              fill="url(#section2BellFill)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.axisLabels}>
        <span>Low</span>
        <span>Average</span>
        <span>High</span>
      </div>
    </article>
  );
}

function ScatterCard() {
  return (
    <article className={`${styles.chartCard} ${styles.scatterCard}`} data-reveal>
      <div className={styles.cardTopline}>
        <span>Population map</span>
        <strong>Trait distribution</strong>
      </div>
      <div className={styles.chartCanvas}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 12, right: 14, bottom: 12, left: 14 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.1)" />
            <XAxis type="number" dataKey="x" axisLine={false} tickLine={false} hide />
            <YAxis type="number" dataKey="y" axisLine={false} tickLine={false} hide />
            <Scatter data={scatterData} fill="#f2f5f2" isAnimationActive={false} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.badgeRow}>
        <span>Balanced symmetry</span>
        <span>92%</span>
      </div>
    </article>
  );
}

function ToneCard() {
  return (
    <article className={`${styles.chartCard} ${styles.toneCard}`} data-reveal>
      <div className={styles.cardTopline}>
        <span>Melanin model</span>
        <strong>Medium concentration</strong>
      </div>
      <div className={styles.chartCanvas}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={toneData} margin={{ top: 8, right: 18, bottom: 8, left: 18 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} hide />
            <YAxis axisLine={false} tickLine={false} hide />
            <Bar dataKey="value" radius={[4, 4, 4, 4]} isAnimationActive={false}>
              {toneData.map((entry, index) => (
                <Cell key={entry.name} fill={index === 3 ? '#f4f7f5' : 'rgba(244,247,245,0.32)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.badgeRow}>
        <span>Your eyes have a medium melanin concentration.</span>
      </div>
    </article>
  );
}

function FeatureCard() {
  return (
    <article className={`${styles.chartCard} ${styles.featureCard}`} data-reveal>
      <div className={styles.cardTopline}>
        <span>Feature comparison</span>
        <strong>Facial thirds</strong>
      </div>
      <div className={styles.lineChart}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={featureBars} margin={{ top: 6, right: 10, bottom: 6, left: 10 }}>
            <XAxis dataKey="label" axisLine={false} tickLine={false} hide />
            <YAxis axisLine={false} tickLine={false} hide domain={[0, 100]} />
            <Line
              dataKey="value"
              type="monotone"
              stroke="#f4f7f5"
              strokeWidth={2}
              dot={{ r: 3, fill: '#f4f7f5', strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.featureList}>
        {featureBars.map((item) => (
          <div className={styles.featureItem} key={item.label}>
            <span>{item.label}</span>
            <div>
              <i style={{ width: `${item.value}%` }} />
            </div>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function Section2() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const context = gsap.context(() => {
      gsap.from('[data-reveal]', {
        autoAlpha: 0,
        y: 28,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.07,
        delay: 0.1,
      });

      gsap.from('[data-portrait]', {
        autoAlpha: 0,
        scale: 0.96,
        duration: 1.1,
        ease: 'power3.out',
        delay: 0.25,
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} data-node-id="8:784">
      <div className={styles.outerFrame}>
        <header className={styles.header} data-reveal>
          <span className={styles.eyebrow}>AI analysis</span>
          <h2>Glow-up insights</h2>
          <p>
            See the exact traits shaping your appearance with visual measurements, trait
            comparisons, and personal aesthetic context.
          </p>
        </header>

        <div className={styles.cardBand}>
          <div className={styles.cardFrame}>
            <div className={styles.visualStack}>
              <ScatterCard />
              <BellCurveCard />

              <div className={styles.portraitWrap} data-portrait>
                <div className={styles.portrait}>
                  <span className={styles.faceHighlight} />
                  <span className={styles.faceShadow} />
                </div>
              </div>

              <ToneCard />
              <FeatureCard />
            </div>
          </div>
          <span className={`${styles.edgeBlur} ${styles.edgeBlurLeft}`} aria-hidden="true" />
          <span className={`${styles.edgeBlur} ${styles.edgeBlurRight}`} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
