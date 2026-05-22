import type { ReactNode } from 'react';

export interface BellCurvePoint {
  density: number;
  percentile: number;
  label: string;
}

export interface FacialThirdMetric {
  label: string;
  value: string;
  width: number;
}

export interface DashboardGridProps {
  children: ReactNode;
  className?: string;
}

export interface TiltCardProps {
  children: ReactNode;
  className?: string;
  depth?: number;
  glare?: boolean;
}

export interface DensityChartCardProps {
  initialDensity?: number;
  className?: string;
}

export interface ScrubPayload {
  activePayload?: Array<{
    payload?: BellCurvePoint;
  }>;
}
