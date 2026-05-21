'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import FaqAccordion from './FaqAccordion';
import type { FaqItem } from './FaqAccordion';
import styles from './TestDetailHeader.module.scss';

/* ── Icon: Plus (+) ── */
const PlusIcon: React.FC<{ color?: string }> = ({ color = '#FFFFFF' }) => (
  <svg
    className={styles.iconSvg}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <line x1="8" y1="3.33" x2="8" y2="12.67" stroke={color} strokeWidth={1.33} strokeLinecap="round" />
    <line x1="3.33" y1="8" x2="12.67" y2="8" stroke={color} strokeWidth={1.33} strokeLinecap="round" />
  </svg>
);

/* ── Icon: X ── */
const XIcon: React.FC<{ color?: string }> = ({ color = '#FFFFFF' }) => (
  <svg
    className={styles.iconSvg}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <line x1="3.33" y1="3.33" x2="12.67" y2="12.67" stroke={color} strokeWidth={1.33} strokeLinecap="round" />
    <line x1="12.67" y1="3.33" x2="3.33" y2="12.67" stroke={color} strokeWidth={1.33} strokeLinecap="round" />
  </svg>
);

/* ── FAQ Data for the featured (teal) section ── */
const featuredFaqItems: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What is included in the facial analysis report?',
    answer:
      'Your report includes a comprehensive breakdown of facial proportions, symmetry analysis, skin quality assessment, and personalised recommendations for improvement based on scientific research and aesthetic principles.',
  },
  {
    id: 'faq-2',
    question: 'How accurate is the AI-powered assessment?',
    answer:
      'Our AI models are trained on over 10 million data points and validated against clinical assessments. The system achieves 94% concordance with expert dermatologists and maxillofacial surgeons.',
  },
  {
    id: 'faq-3',
    question: 'Can I request a follow-up analysis?',
    answer:
      'Absolutely. You can request a follow-up analysis at any time from your dashboard. We recommend waiting at least 3 months between analyses to see meaningful changes.',
  },
  {
    id: 'faq-4',
    question: 'How long does the full analysis take?',
    answer:
      'The AI-powered analysis is generated within 60 seconds of uploading your photos. The full personalised report, including treatment recommendations, is delivered within 24 hours.',
  },
  {
    id: 'faq-5',
    question: 'What facial features are measured?',
    answer:
      'We measure over 80 facial landmarks including facial thirds, canthal tilt, gonial angle, midface ratio, nasal projection, lip proportions, jawline definition, and overall facial symmetry.',
  },
  {
    id: 'faq-6',
    question: 'Is my uploaded data kept private?',
    answer:
      'Yes. All uploaded photos are encrypted at rest and in transit. We never share your data with third parties. You can permanently delete your data at any time from your account settings.',
  },
  {
    id: 'faq-7',
    question: 'Can I share my results with a clinician?',
    answer:
      'Yes. Your report includes a shareable PDF with detailed measurements and visualisations that you can bring to any aesthetic clinician or dermatologist.',
  },
  {
    id: 'faq-8',
    question: 'How often should I get re-analysed?',
    answer:
      'We recommend a re-analysis every 3–6 months if you are actively following a skincare or treatment plan. This helps track your progress with quantitative data.',
  },
  {
    id: 'faq-9',
    question: 'What file formats are supported for upload?',
    answer:
      'We support JPEG, PNG, and HEIC formats. For best results, use a well-lit, front-facing photo taken at eye level with a neutral expression.',
  },
];

/* ── Accordion categories with sub-items ── */
const accordionCategories: { label: string; items: FaqItem[] }[] = [
  {
    label: 'Analysis overview',
    items: [
      {
        id: 'ao-1',
        question: 'What kind of analysis do you provide?',
        answer:
          'We offer a multi-dimensional facial analysis covering proportions, symmetry, skin quality, and personalised improvement recommendations based on peer-reviewed research.',
      },
      {
        id: 'ao-2',
        question: 'How is this different from a filter or beauty score app?',
        answer:
          'Unlike simple scoring apps, our analysis is grounded in clinical research and provides actionable, personalised advice — not a vanity metric.',
      },
    ],
  },
  {
    label: 'Facial proportions',
    items: [
      {
        id: 'fp-1',
        question: 'What are facial thirds?',
        answer:
          'Facial thirds divide the face into three horizontal sections: hairline to brow, brow to nose base, and nose base to chin. Balanced thirds are a key marker of facial harmony.',
      },
      {
        id: 'fp-2',
        question: 'Do you measure the golden ratio?',
        answer:
          'We measure proportions that correlate with attractiveness research, including ratios aligned with phi (1.618). However, we emphasise personalised improvement over chasing a single ideal.',
      },
    ],
  },
  {
    label: 'Treatment options',
    items: [
      {
        id: 'to-1',
        question: 'Do you recommend surgical procedures?',
        answer:
          'We provide a full range of options from skincare routines and lifestyle changes to non-invasive and surgical treatments. You decide what is right for you.',
      },
      {
        id: 'to-2',
        question: 'Are the treatment plans personalised?',
        answer:
          'Yes. Every recommendation is tailored to your facial measurements, skin type, goals, and budget. No two reports are the same.',
      },
    ],
  },
  {
    label: 'Privacy & security',
    items: [
      {
        id: 'ps-1',
        question: 'Who has access to my photos?',
        answer:
          'Only our analysis engine processes your photos. No human reviews your images unless you explicitly request a manual assessment.',
      },
      {
        id: 'ps-2',
        question: 'Can I delete my data?',
        answer:
          'Yes. You can permanently delete all your data, including photos and reports, from your account settings at any time.',
      },
    ],
  },
  {
    label: 'Subscription & plans',
    items: [
      {
        id: 'sp-1',
        question: 'Is there a free tier?',
        answer:
          'We offer a free initial assessment with a summary report. Full detailed reports, progress tracking, and treatment plans require a subscription.',
      },
      {
        id: 'sp-2',
        question: 'Can I cancel at any time?',
        answer:
          'Yes. All subscriptions can be cancelled at any time from your account dashboard with no cancellation fees.',
      },
    ],
  },
  {
    label: 'Results & progress',
    items: [
      {
        id: 'rp-1',
        question: 'How do I track my progress over time?',
        answer:
          'Your dashboard shows a timeline of all analyses with comparative metrics, allowing you to visualise changes in symmetry, proportions, and skin quality over time.',
      },
      {
        id: 'rp-2',
        question: 'Will I see improvement after following recommendations?',
        answer:
          'Most users who follow their personalised skincare and lifestyle recommendations report noticeable improvements within 8–12 weeks.',
      },
    ],
  },
  {
    label: 'General questions',
    items: [
      {
        id: 'gq-1',
        question: 'What age group is this suitable for?',
        answer:
          'Our analysis is designed for adults 18 and over. Facial proportions change significantly during adolescence, so we recommend waiting until facial development is complete.',
      },
      {
        id: 'gq-2',
        question: 'Do you support all ethnicities?',
        answer:
          'Yes. Our AI models are trained on a diverse, multi-ethnic dataset and adapt recommendations to account for ethnic variation in facial structure and beauty standards.',
      },
    ],
  },
];

/* ── GSAP-animated category row ── */
interface CategoryRowProps {
  category: { label: string; items: FaqItem[] };
  isOpen: boolean;
  isLast: boolean;
  onToggle: () => void;
}

function CategoryRow({ category, isOpen, isLast, onToggle }: CategoryRowProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const wrapper = contentRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    tweenRef.current?.kill();

    if (isOpen) {
      const naturalHeight = inner.scrollHeight;
      tweenRef.current = gsap.fromTo(
        wrapper,
        { height: 0, opacity: 0 },
        {
          height: naturalHeight,
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
          onComplete: () => gsap.set(wrapper, { height: 'auto' }),
        },
      );
    } else {
      const currentHeight = wrapper.scrollHeight;
      if (currentHeight > 0) {
        gsap.set(wrapper, { height: currentHeight });
        tweenRef.current = gsap.to(wrapper, {
          height: 0,
          opacity: 0,
          duration: 0.35,
          ease: 'power2.inOut',
        });
      }
    }

    return () => { tweenRef.current?.kill(); };
  }, [isOpen]);

  return (
    <div className={`${styles.iconContainer} ${isLast ? styles.noBorderBottom : ''}`}>
      <div className={styles.categoryWrapper}>
        <button
          type="button"
          className={styles.accordionHeader}
          onClick={onToggle}
          aria-expanded={isOpen}
        >
          <h3 className={styles.accordionHeading}>{category.label}</h3>
          <span className={styles.iconBtn}>
            {isOpen ? <XIcon color="#233137" /> : <PlusIcon color="#758084" />}
          </span>
        </button>

        <div ref={contentRef} className={styles.categoryContentWrapper}>
          <div ref={innerRef} className={styles.categoryContent}>
            <FaqAccordion items={category.items} variant="light" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
const TestDetailHeader: React.FC = () => {
  // Unified state: only 1 major section open at a time
  // 'featured' = teal General Questions, 'cat-0'..'cat-N' = category rows
  const [openSection, setOpenSection] = useState<string | null>('featured');
  const featuredContentRef = useRef<HTMLDivElement | null>(null);
  const featuredInnerRef = useRef<HTMLDivElement | null>(null);
  const featuredTweenRef = useRef<gsap.core.Tween | null>(null);

  const isFeaturedOpen = openSection === 'featured';

  const toggleSection = useCallback((sectionId: string) => {
    setOpenSection((prev) => (prev === sectionId ? null : sectionId));
  }, []);

  // Animate the featured (teal) section open/close
  useEffect(() => {
    const wrapper = featuredContentRef.current;
    const inner = featuredInnerRef.current;
    if (!wrapper || !inner) return;

    featuredTweenRef.current?.kill();

    if (isFeaturedOpen) {
      const naturalHeight = inner.scrollHeight;
      featuredTweenRef.current = gsap.fromTo(
        wrapper,
        { height: 0, opacity: 0 },
        {
          height: naturalHeight,
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
          onComplete: () => gsap.set(wrapper, { height: 'auto' }),
        },
      );
    } else {
      const currentHeight = wrapper.scrollHeight;
      if (currentHeight > 0) {
        gsap.set(wrapper, { height: currentHeight });
        featuredTweenRef.current = gsap.to(wrapper, {
          height: 0,
          opacity: 0,
          duration: 0.35,
          ease: 'power2.inOut',
        });
      }
    }

    return () => { featuredTweenRef.current?.kill(); };
  }, [isFeaturedOpen]);

  return (
    <section className={styles.content}>
      <div className={styles.glowUpContainer}>
        {/* ── Card Header ── */}
        <header className={styles.cardHeader}>
          <div className={styles.badge}>
            <span className={styles.featureText}>YOUR QUESTIONS</span>
          </div>
          <h2 className={styles.title}>
            Frequently asked <span className={styles.titleMuted}>questions</span>
          </h2>
          <p className={styles.subtitle}>
            If you have any further questions, please use the chat box in the bottom right or contact us by email at hello@qoves.com
          </p>
        </header>

        {/* ── Test Details Container ── */}
        <div className={styles.testDetailsContainer}>
          {/* Featured Card (teal) — collapsible */}
          <div className={styles.testDetails}>
            {/* Decorative watermark */}
            <span className={styles.watermark} aria-hidden="true">
              5676
            </span>

            {/* Content */}
            <div className={styles.testDetailContent}>
              {/* Featured Header — clickable to toggle */}
              <button
                type="button"
                className={styles.featuredHeader}
                onClick={() => toggleSection('featured')}
                aria-expanded={isFeaturedOpen}
              >
                <h3 className={styles.featuredHeading}>
                  General Questions
                </h3>
                <span className={styles.iconBtn}>
                  {isFeaturedOpen ? <XIcon /> : <PlusIcon />}
                </span>
              </button>

              {/* FAQ Items — GSAP animated wrapper */}
              <div ref={featuredContentRef} className={styles.featuredContentWrapper}>
                <div ref={featuredInnerRef} className={styles.faqContainer}>
                  <FaqAccordion items={featuredFaqItems} defaultOpenId="faq-1" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Accordion Category Rows with GSAP animations ── */}
          {accordionCategories.map((category, index) => {
            const sectionId = `cat-${index}`;
            return (
              <CategoryRow
                key={category.label}
                category={category}
                isOpen={openSection === sectionId}
                isLast={index === accordionCategories.length - 1}
                onToggle={() => toggleSection(sectionId)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestDetailHeader;

