'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import styles from './TestDetailHeader.module.scss';

/* ── Types ── */
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqCategory {
  id: string;
  label: string;
  items: FaqItem[];
}

/* ── SVG Icons ── */
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

/* ── FAQ Unified Categories Dataset (9 Categories Total) ── */
const faqCategories: FaqCategory[] = [
  {
    id: 'General Questions',
    label: 'General Questions',
    items: [
      {
        id: 'faq-1',
        question: "What's included in the facial analysis?",
        answer:
          'Your report includes a comprehensive breakdown of facial proportions, symmetry analysis, skin quality assessment, and personalised recommendations for improvement based on scientific research and aesthetic principles.',
      },
      {
        id: 'faq-2',
        question: 'How accurate is your analysis?',
        answer:
          'Our AI models are trained on over 10 million data points and validated against clinical assessments. The system achieves 94% concordance with expert dermatologists and maxillofacial surgeons.',
      },
      {
        id: 'faq-3',
        question: 'Is this actually science-backed, or just AI hype?',
        answer:
          'Absolutely. All findings are grounded in peer-reviewed scientific literature and validated by practicing aesthetic surgeons and dermatologists.',
      },
      {
        id: 'faq-4',
        question: 'Does it work for all ethnicities?',
        answer:
          'Yes. Our AI models are trained on a highly diverse, global dataset and adjust reference standards dynamically based on demographic factors to ensure accurate, personalized metrics.',
      },
      {
        id: 'faq-5',
        question: 'How often can I get a new analysis?',
        answer:
          'Every year, you upload a new set of photos and answer a few questions to receive a fresh analysis, updated glow-up protocol, and new biometric scores.',
      },
    ],
  },
  {
    id: 'about-protocol',
    label: 'About The Protocol',
    items: [
      {
        id: 'ap-1',
        question: 'What is a facial glow-up protocol?',
        answer:
          'A personalized protocol is a step-by-step skincare, lifestyle, and treatment plan designed specifically for your facial characteristics to enhance symmetry and skin quality.',
      },
      {
        id: 'ap-2',
        question: 'How do I follow my protocol?',
        answer:
          'You can track your daily routines and recommended treatments directly from your dashboard. We provide easy-to-follow instructions and product recommendations.',
      },
    ],
  },
  {
    id: 'experience-use',
    label: 'Experience & Use',
    items: [
      {
        id: 'eu-1',
        question: 'Who can use the platform?',
        answer:
          'Our analysis is designed for individuals aged 18 and over, as facial structure and proportions change significantly during adolescence.',
      },
      {
        id: 'eu-2',
        question: 'Is my uploaded photo kept private?',
        answer:
          'Yes, privacy is our highest priority. All photos are fully encrypted, processed automatically by our AI models, and never shared with third parties.',
      },
    ],
  },
  {
    id: 'pricing-subscription',
    label: 'Pricing & Subscription',
    items: [
      {
        id: 'ps-1',
        question: 'Are there any hidden fees?',
        answer:
          'No. All pricing is fully transparent. You can choose between a one-off analysis or a subscription for ongoing progress tracking.',
      },
      {
        id: 'ps-2',
        question: 'Can I cancel my subscription anytime?',
        answer:
          'Yes, you can cancel or change your subscription plan at any time directly from your billing portal with no cancellation fees.',
      },
    ],
  },
  {
    id: 'photo-requirements',
    label: 'Photo & Upload Requirements',
    items: [
      {
        id: 'pr-1',
        question: 'What type of photos should I upload?',
        answer:
          'To ensure accurate analysis, please upload well-lit photos taken at eye level, using a neutral facial expression without makeup or glasses.',
      },
      {
        id: 'pr-2',
        question: 'Can I upload photos taken with a phone?',
        answer:
          'Absolutely. Modern smartphones have excellent cameras that are perfectly suitable. Just ensure the back camera is used with natural lighting and no filters.',
      },
    ],
  },
  {
    id: 'privacy-security',
    label: 'Privacy & Data Security',
    items: [
      {
        id: 'pv-1',
        question: 'Are my photos deleted after the analysis?',
        answer:
          'Yes. All uploaded photos are processed in memory and deleted from our processing servers immediately. If you opt-in to save your report, data is fully encrypted.',
      },
      {
        id: 'pv-2',
        question: 'Who has access to my facial data?',
        answer:
          'Access is restricted to automated algorithms and strictly confidential. We never sell, share, or disclose your biometric data to third parties.',
      },
    ],
  },
  {
    id: 'results-recs',
    label: 'Results & Recommendations',
    items: [
      {
        id: 'rr-1',
        question: 'How do I read my biometric score?',
        answer:
          'Your biometric scores compare specific facial ratios to demographic and aesthetic research databases. They are designed for self-improvement and progress tracking.',
      },
      {
        id: 'rr-2',
        question: 'What treatments are typically suggested?',
        answer:
          'We focus primarily on non-invasive skincare routines, postural improvements, facial exercise patterns, and science-backed lifestyle changes.',
      },
    ],
  },
  {
    id: 'dermatological-standards',
    label: 'Dermatological Standards',
    items: [
      {
        id: 'ds-1',
        question: 'Are these suggestions approved by dermatologists?',
        answer:
          'Yes, our recommendation engine is co-developed with clinical dermatologists to ensure that skincare advice is safe, modern, and clinically validated.',
      },
      {
        id: 'ds-2',
        question: 'What if I have an existing skin condition?',
        answer:
          'Our advice is purely educational. If you have conditions like active eczema, psoriasis, or severe acne, we strongly advise consulting your personal physician first.',
      },
    ],
  },
  {
    id: 'support-refunds',
    label: 'Support & Refunds',
    items: [
      {
        id: 'sr-1',
        question: 'Can I get a refund if I am unsatisfied?',
        answer:
          'Yes. We offer a 14-day refund policy for analyses that fail to generate or if the system is unable to process your photo successfully due to technical errors.',
      },
      {
        id: 'sr-2',
        question: 'How do I contact customer support?',
        answer:
          'You can contact our support team at hello@qoves.com or use the interactive support chat bubble in the bottom right corner of the dashboard.',
      },
    ],
  },
];

/* ── Minor Accordion Item (Question) ── */
interface AccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: (id: string) => void;
}

function AccordionItem({ item, isOpen, onToggle }: AccordionItemProps) {
  const answerWrapperRef = useRef<HTMLDivElement | null>(null);
  const answerInnerRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const iconTweenRef = useRef<gsap.core.Tween | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const wrapper = answerWrapperRef.current;
    const inner = answerInnerRef.current;
    const icon = iconRef.current;
    if (!wrapper || !inner || !icon) return;

    const verticalLine = icon.querySelector('[data-vertical]') as SVGLineElement | null;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (isOpen) {
        gsap.set(wrapper, { height: 'auto', opacity: 1 });
        if (verticalLine) gsap.set(verticalLine, { scaleY: 0 });
      } else {
        gsap.set(wrapper, { height: 0, opacity: 0 });
        if (verticalLine) gsap.set(verticalLine, { scaleY: 1 });
      }
      return;
    }

    tweenRef.current?.kill();
    iconTweenRef.current?.kill();

    if (isOpen) {
      const naturalHeight = inner.scrollHeight;
      tweenRef.current = gsap.fromTo(
        wrapper,
        { height: 0, opacity: 0 },
        {
          height: naturalHeight,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
          onComplete: () => {
            gsap.set(wrapper, { height: 'auto' });
          },
        }
      );

      if (verticalLine) {
        iconTweenRef.current = gsap.to(verticalLine, {
          scaleY: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    } else {
      const currentHeight = wrapper.scrollHeight;
      gsap.set(wrapper, { height: currentHeight });

      tweenRef.current = gsap.to(wrapper, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });

      if (verticalLine) {
        iconTweenRef.current = gsap.to(verticalLine, {
          scaleY: 1,
          duration: 0.3,
          ease: 'power2.inOut',
        });
      }
    }

    return () => {
      tweenRef.current?.kill();
      iconTweenRef.current?.kill();
    };
  }, [isOpen]);

  return (
    <div className={`${styles.item} ${isOpen ? styles.itemActive : ''}`}>
      <button
        type="button"
        className={styles.itemHeader}
        onClick={() => onToggle(item.id)}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        id={`faq-header-${item.id}`}
      >
        <span className={styles.question}>{item.question}</span>
        <div className={styles.iconWrap} ref={iconRef}>
          <svg
            className={styles.iconSvg}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <line
              x1="8" y1="3.33" x2="8" y2="12.67"
              stroke="currentColor"
              strokeWidth={1.33}
              strokeLinecap="round"
              data-vertical=""
              style={{ transformOrigin: 'center' }}
            />
            <line
              x1="3.33" y1="8" x2="12.67" y2="8"
              stroke="currentColor"
              strokeWidth={1.33}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </button>

      <div
        ref={answerWrapperRef}
        className={styles.answerWrapper}
        id={`faq-answer-${item.id}`}
        role="region"
        aria-labelledby={`faq-header-${item.id}`}
      >
        <div ref={answerInnerRef} className={styles.answerInner}>
          <p className={styles.answerText}>{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Major Category Row (GSAP + CSS Transitions) ── */
interface CategoryRowProps {
  category: FaqCategory;
  isOpen: boolean;
  isLast: boolean;
  onToggle: () => void;
  activeMinorId: string | null;
  onMinorToggle: (id: string) => void;
}

function CategoryRow({
  category,
  isOpen,
  isLast,
  onToggle,
  activeMinorId,
  onMinorToggle,
}: CategoryRowProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const wrapper = contentRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (isOpen) {
        gsap.set(wrapper, { height: 'auto', opacity: 1 });
      } else {
        gsap.set(wrapper, { height: 0, opacity: 0 });
      }
      return;
    }

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
          onComplete: () => {
            gsap.set(wrapper, { height: 'auto' });
          },
        }
      );
    } else {
      const currentHeight = wrapper.scrollHeight;
      gsap.set(wrapper, { height: currentHeight });

      tweenRef.current = gsap.to(wrapper, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
      });
    }

    return () => {
      tweenRef.current?.kill();
    };
  }, [isOpen]);

  return (
    <div
      className={`${styles.categoryRow} ${isOpen ? styles.categoryRowOpen : ''} ${isLast ? styles.noBorderBottom : ''
        }`}
    >
      <button
        type="button"
        className={styles.accordionHeader}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <h3 className={styles.accordionHeading}>{category.label}</h3>
        <span className={styles.iconBtn}>
          {isOpen ? <XIcon color="#ffffff" /> : <PlusIcon color="#758084" />}
        </span>
      </button>

      <div ref={contentRef} className={styles.categoryContentWrapper}>
        <div ref={innerRef} className={styles.categoryContent}>
          <div className={styles.faqContainer}>
            {category.items.map((item) => (
              <AccordionItem
                key={item.id}
                item={item}
                isOpen={activeMinorId === item.id}
                onToggle={onMinorToggle}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
const TestDetailHeader: React.FC = () => {
  // Unified single-accordion states:
  // Starts with 'about-analysis' open and its 'faq-5' question expanded
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>('about-analysis');
  const [activeMinorId, setActiveMinorId] = useState<string | null>('faq-5');

  const handleCategoryToggle = useCallback((id: string) => {
    setActiveCategoryId((prev) => {
      const next = prev === id ? null : id;
      // Close all minor questions when a category transitions
      setActiveMinorId(null);
      return next;
    });
  }, []);

  const handleMinorToggle = useCallback((id: string) => {
    setActiveMinorId((prev) => (prev === id ? null : id));
  }, []);

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

        {/* ── Test Details Container (FAQ Table) ── */}
        <div className={styles.testDetailsContainer}>
          {faqCategories.map((category, index) => {
            const isOpen = activeCategoryId === category.id;
            const isLast = index === faqCategories.length - 1;
            return (
              <CategoryRow
                key={category.id}
                category={category}
                isOpen={isOpen}
                isLast={isLast}
                onToggle={() => handleCategoryToggle(category.id)}
                activeMinorId={activeMinorId}
                onMinorToggle={handleMinorToggle}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestDetailHeader;
