'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './EndSectionPart2.module.scss';

gsap.registerPlugin(ScrollTrigger);

type AnswerPanel = {
  title: string;
  items: string[];
  placement: 'left' | 'right';
};

const panels: AnswerPanel[] = [
  {
    title: 'Consider this...',
    placement: 'left',
    items: [
      "It's your primary tool for communicating with others",
      'First impressions matter',
      'It has a considerable impact on interpersonal interactions',
      'Small improvements can drastically impact quality of life',
    ],
  },
  {
    title: 'The key is approaching\nit intelligently',
    placement: 'right',
    items: [
      'Not chasing unrealistic standards',
      'Not trying to look like someone else',
      'Not seeking perfection',
      'Aiming only for a better version of yourself',
    ],
  },
];

function PanelCard({ title, items, placement }: AnswerPanel) {
  return (
    <aside
      className={`${styles.panel} ${styles[placement]}`}
      data-panel={placement}
    >
      <h3>{title}</h3>
      <div className={styles.panelItems}>
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </aside>
  );
}

export default function EndSectionPart2() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const statement = section.querySelector('[data-statement]') as HTMLElement;
    const leftPanel = section.querySelector('[data-panel="left"]') as HTMLElement;
    const rightPanel = section.querySelector('[data-panel="right"]') as HTMLElement;
    if (!statement || !leftPanel || !rightPanel) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=3000',        // 3000px of scroll travel for all animations
          pin: true,
          scrub: true,
          anticipatePin: 1,
        },
      });

      // ── Phase 1: Statement scrolls up and sticks in center ──
      // It starts below viewport and moves to center (already centered via CSS,
      // so we animate FROM an offset below).
      tl.fromTo(
        statement,
        { y: 200, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, ease: 'none' },
        0
      );

      // ── Phase 2: Left panel enters from the left, scrolls through ──
      tl.fromTo(
        leftPanel,
        { x: -600, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 1.5, ease: 'power2.out' },
        0.8
      );
      // Left panel scrolls up and out
      tl.to(
        leftPanel,
        { y: -800, autoAlpha: 0, duration: 1.5, ease: 'none' },
        2.5
      );

      // ── Phase 3: Right panel enters from the right, scrolls through ──
      tl.fromTo(
        rightPanel,
        { x: 600, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 1.5, ease: 'power2.out' },
        2.0
      );
      // Right panel scrolls up and out
      tl.to(
        rightPanel,
        { y: -800, autoAlpha: 0, duration: 1.5, ease: 'none' },
        3.8
      );

      // ── Phase 4: Statement fades out at the end ──
      tl.to(
        statement,
        { y: -200, autoAlpha: 0, duration: 1, ease: 'none' },
        4.5
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} data-node-id="5:60">
      <div className={styles.content}>
        <div className={styles.frame}>
          <div className={styles.statement} data-statement>
            <h2>
              Is it vain to care
              <span>about your appearance?</span>
            </h2>
            <p>
              Many feel guilty about wanting to improve their looks, fearing it means they&apos;re
              shallow or insecure. But here&apos;s what research tells us : caring about appearance
              is natural. Like health, finances, and education, it&apos;s just another form of
              self-improvement.
            </p>
          </div>

          {panels.map((panel) => (
            <PanelCard key={panel.placement} {...panel} />
          ))}
        </div>
      </div>
    </section>
  );
}
