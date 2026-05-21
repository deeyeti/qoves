'use client';

import React, { useState } from 'react';
import styles from './TestDetailHeader.module.scss';

/* ── Icon Components ── */
const PlusIcon: React.FC<{ color?: string; strokeWidth?: number }> = ({
  color = '#758084',
  strokeWidth = 1,
}) => (
  <svg
    className={styles.iconSvg}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <line x1="8" y1="3.33" x2="8" y2="12.67" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <line x1="3.33" y1="8" x2="12.67" y2="8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

const MinusIcon: React.FC<{ color?: string; strokeWidth?: number }> = ({
  color = '#FFFFFF',
  strokeWidth = 1.33,
}) => (
  <svg
    className={styles.iconSvg}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <line x1="3.33" y1="8" x2="12.67" y2="8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

/* ── FAQ Data ── */
interface FaqItem {
  id: number;
  question: string;
  answer?: string;
}

const featuredFaqItems: FaqItem[] = [
  {
    id: 1,
    question: 'What is included in the facial analysis report?',
    answer:
      'Your report includes a comprehensive breakdown of facial proportions, symmetry analysis, skin quality assessment, and personalised recommendations for improvement based on scientific research and aesthetic principles.',
  },
  { id: 2, question: 'How accurate is the AI-powered assessment?' },
  { id: 3, question: 'Can I request a follow-up analysis?' },
  { id: 4, question: 'How long does the full analysis take?' },
  { id: 5, question: 'What facial features are measured?' },
  { id: 6, question: 'Is my uploaded data kept private?' },
  { id: 7, question: 'Can I share my results with a clinician?' },
  { id: 8, question: 'How often should I get re-analysed?' },
  { id: 9, question: 'What file formats are supported for upload?' },
];

const accordionCategories = [
  'Aggregate information',
  'Analysis overview',
  'Facial proportions',
  'Treatment options',
  'Privacy & security',
  'Subscription & plans',
  'Results & progress',
  'General questions',
];

/* ── Main Component ── */
const TestDetailHeader: React.FC = () => {
  const [expandedItem, setExpandedItem] = useState<number>(1);

  return (
    <section className={styles.content}>
      <div className={styles.glowUpContainer}>
        {/* ── Card Header ── */}
        <header className={styles.cardHeader}>
          <div className={styles.badge}>
            <span className={styles.featureText}>INSIGHTS</span>
          </div>
          <h2 className={styles.title}>Questions? We&apos;ve got answers</h2>
          <p className={styles.subtitle}>
            Everything you need to know about your facial analysis and
            personalised glow-up plan.
          </p>
        </header>

        {/* ── Test Details Container ── */}
        <div className={styles.testDetailsContainer}>
          {/* Featured Card (teal) */}
          <div className={styles.testDetails}>
            {/* Decorative watermark */}
            <span className={styles.watermark} aria-hidden="true">
              5676
            </span>

            {/* Content */}
            <div className={styles.testDetailContent}>
              {/* Featured Header */}
              <div className={styles.featuredHeader}>
                <h3 className={styles.featuredHeading}>
                  Aggregate information
                </h3>
                <button
                  type="button"
                  className={styles.iconBtn}
                  aria-label="Collapse section"
                >
                  <MinusIcon />
                </button>
              </div>

              {/* FAQ Items (frosted glass container) */}
              <div className={styles.faqContainer}>
                {featuredFaqItems.map((item, index) => {
                  const isExpanded = expandedItem === item.id;
                  const isLast = index === featuredFaqItems.length - 1;

                  if (isExpanded) {
                    return (
                      <div key={item.id} className={styles.expandedItem}>
                        <div className={styles.questionBlock}>
                          <span className={styles.questionText}>
                            {item.question}
                          </span>
                          {item.answer && (
                            <div className={styles.answerRow}>
                              <p className={styles.answerText}>
                                {item.answer}
                              </p>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          aria-label="Collapse"
                          onClick={() => setExpandedItem(-1)}
                        >
                          <MinusIcon />
                        </button>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`${styles.collapsedItem} ${isLast ? styles.noBorder : ''}`}
                      onClick={() => setExpandedItem(item.id)}
                    >
                      <div className={styles.collapsedContent}>
                        <span className={styles.collapsedText}>
                          {item.question}
                        </span>
                      </div>
                      <PlusIcon color="#FFFFFF" strokeWidth={1.33} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Accordion Category Rows ── */}
          {accordionCategories.map((category, index) => (
            <div
              key={category}
              className={`${styles.iconContainer} ${
                index === accordionCategories.length - 1
                  ? styles.noBorderBottom
                  : ''
              }`}
            >
              <div className={styles.accordionHeader}>
                <h3 className={styles.accordionHeading}>{category}</h3>
                <button
                  type="button"
                  className={styles.iconBtn}
                  aria-label={`Expand ${category}`}
                >
                  <PlusIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestDetailHeader;
