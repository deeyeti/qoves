'use client';

import { useRef } from 'react';
import styles from './FacialDashboard.module.scss';
import type { DashboardGridProps } from './types';

export function DashboardGrid({ children, className = '' }: DashboardGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`${styles.dashboardGrid} ${className}`} ref={gridRef}>
      {children}
    </div>
  );
}
