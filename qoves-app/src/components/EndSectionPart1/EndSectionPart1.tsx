'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './EndSectionPart1.module.scss';
import card1 from './card 1.png';
import card2 from './card 2.png';
import card3 from './card 3.png';

gsap.registerPlugin(useGSAP);

/* ── Types ── */
type InsightCard = {
  title: string;
  description: string;
  preview: 'lifestyle' | 'culture' | 'genetics';
};

/* ── Data ── */
const cards: InsightCard[] = [
  {
    title: 'Lifestyle factors',
    description: 'Considers diet, climate, stress, sleep, and habits.',
    preview: 'lifestyle',
  },
  {
    title: 'Cultural beauty standards',
    description: 'Adapts to regional and societal ideals.',
    preview: 'culture',
  },
  {
    title: 'Genetic factors',
    description:
      'Takes into account genetic factors and how they might impact your facial aesthetics.',
    preview: 'genetics',
  },
];

/* ── Preview sub-components ──
 * aria-hidden on the wrapper suppresses the entire subtree from the AT tree.
 * alt="" on the img is therefore redundant but is correct practice in case
 * aria-hidden is ever removed from the wrapper.
 */
function LifestylePreview() {
  return (
    <div className={styles.preview} aria-hidden="true">
      <img src={card1.src} className={styles.previewImage} alt="" />
    </div>
  );
}

function CulturePreview() {
  return (
    <div className={styles.preview} aria-hidden="true">
      <img src={card2.src} className={styles.previewImage} alt="" />
    </div>
  );
}

function GeneticsPreview() {
  return (
    <div className={styles.preview} aria-hidden="true">
      <img src={card3.src} className={styles.previewImage} alt="" />
    </div>
  );
}

function CardPreview({ type }: { type: InsightCard['preview'] }) {
  if (type === 'culture') return <CulturePreview />;
  if (type === 'genetics') return <GeneticsPreview />;
  return <LifestylePreview />;
}

/* ── Main Component ── */
export default function EndSectionPart1() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      gsap.from('[data-reveal]', {
        autoAlpha: 0,
        y: 28,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.15,
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-node-id="1:2036"
      aria-label="Will analyzing my face make me insecure?"
    >
      <div className={styles.content}>
        <div className={styles.wrapper}>
          <div className={styles.hero}>
            <div className={styles.questionBlock} data-reveal>
              <h2>
                Will analyzing my face
                <span>Make me insecure?</span>
              </h2>
              <p>
                Most insecurity comes from uncertainty-not knowing if your concerns are real or
                imagined. When you&apos;re guessing about your appearance, your mind often makes
                things seem worse than they are.
              </p>
            </div>
          </div>

          <div className={styles.cardGrid} data-card-grid>
            {cards.map((card) => (
              <article className={styles.card} data-reveal key={card.title}>
                <div className={styles.innerContainer}>
                  <div className={styles.previewWrapper}>
                    <CardPreview type={card.preview} />
                  </div>
                  <div className={styles.cardText}>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
