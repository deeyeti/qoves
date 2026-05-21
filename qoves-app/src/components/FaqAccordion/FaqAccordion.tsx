'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './FaqAccordion.module.scss';

/* ── Types ── */
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  /** Optional: id of the item that should start expanded */
  defaultOpenId?: string | null;
  /** Color variant — 'dark' for white-on-dark, 'light' for dark-on-light */
  variant?: 'dark' | 'light';
}

/* ── Plus / Minus icon (single SVG, GSAP rotates it 45° to become ×/−) ── */
const PlusIcon: React.FC = () => (
  <svg
    className={styles.iconSvg}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <line
      x1="8"
      y1="3.33"
      x2="8"
      y2="12.67"
      stroke="currentColor"
      strokeWidth={1.33}
      strokeLinecap="round"
      className="vertical-bar"
    />
    <line
      x1="3.33"
      y1="8"
      x2="12.67"
      y2="8"
      stroke="currentColor"
      strokeWidth={1.33}
      strokeLinecap="round"
    />
  </svg>
);

/* ── Single accordion item ── */
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

  useEffect(() => {
    const wrapper = answerWrapperRef.current;
    const inner = answerInnerRef.current;
    const icon = iconRef.current;
    if (!wrapper || !inner || !icon) return;

    // Kill any in-flight tweens before starting new ones
    tweenRef.current?.kill();
    iconTweenRef.current?.kill();

    if (isOpen) {
      // Measure the natural height of the answer content
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
            // After animation, set height to auto so it reflows on resize
            gsap.set(wrapper, { height: 'auto' });
          },
        },
      );

      // Rotate the + icon: the vertical bar fades/rotates to form a −
      iconTweenRef.current = gsap.to(icon, {
        rotation: 45,
        duration: 0.35,
        ease: 'power2.out',
      });

      // Also hide the vertical bar of the plus
      const verticalBar = icon.querySelector('.vertical-bar') as SVGLineElement | null;
      if (verticalBar) {
        gsap.to(verticalBar, {
          opacity: 0,
          duration: 0.25,
          ease: 'power2.out',
        });
      }
    } else {
      // Capture current height before collapsing
      const currentHeight = wrapper.scrollHeight;
      gsap.set(wrapper, { height: currentHeight });

      tweenRef.current = gsap.to(wrapper, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
      });

      iconTweenRef.current = gsap.to(icon, {
        rotation: 0,
        duration: 0.35,
        ease: 'power2.inOut',
      });

      const verticalBar = icon.querySelector('.vertical-bar') as SVGLineElement | null;
      if (verticalBar) {
        gsap.to(verticalBar, {
          opacity: 1,
          duration: 0.25,
          ease: 'power2.inOut',
        });
      }
    }

    // Cleanup on unmount
    return () => {
      tweenRef.current?.kill();
      iconTweenRef.current?.kill();
    };
  }, [isOpen]);

  return (
    <div
      className={`${styles.item} ${isOpen ? styles.itemActive : ''}`}
    >
      <button
        type="button"
        className={styles.header}
        onClick={() => onToggle(item.id)}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        id={`faq-header-${item.id}`}
      >
        <span className={styles.question}>{item.question}</span>
        <div className={styles.iconWrap} ref={iconRef}>
          <PlusIcon />
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

/* ── Main Accordion ── */
export default function FaqAccordion({ items, defaultOpenId = null, variant = 'dark' }: FaqAccordionProps) {
  const [activeId, setActiveId] = useState<string | null>(defaultOpenId);

  const handleToggle = useCallback((id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className={`${styles.accordion} ${styles[variant]}`}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={activeId === item.id}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
