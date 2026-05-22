'use client';

import React from 'react';
import type { TiltCardProps } from './types';
import styles from './FacialDashboard.module.scss';

export function TiltCard({
  children,
  className = '',
  depth = 12,
  glare: _glare = true,
  ...rest
}: TiltCardProps & React.HTMLAttributes<HTMLElement>) {
  return (
    <article
      className={`${styles.tiltCard} ${className}`}
      data-depth={depth}
      data-tilt-card
      {...rest}
    >
      {children}
    </article>
  );
}
