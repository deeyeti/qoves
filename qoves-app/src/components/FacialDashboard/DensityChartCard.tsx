'use client';

import { useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styles from './FacialDashboard.module.scss';
import type { BellCurvePoint, DensityChartCardProps } from './types';

gsap.registerPlugin(useGSAP);

interface RechartsMouseState {
  activePayload?: Array<{
    payload?: BellCurvePoint;
  }>;
  isTooltipActive?: boolean;
}

interface CursorProps {
  points?: Array<{ x: number; y: number }>;
  height?: number;
  top?: number;
}

function getDensityCategory(x: number): string {
  if (x < 33) return 'LOW DENSITY';
  if (x <= 66) return 'MEDIUM DENSITY';
  return 'HIGH DENSITY';
}

function buildBellCurveData(): BellCurvePoint[] {
  const mean = 50;
  const sigma = 16;
  return Array.from({ length: 101 }, (_, x) => {
    const exponent = -0.5 * Math.pow((x - mean) / sigma, 2);
    const y = Math.exp(exponent);
    return {
      density: x,
      percentile: Number((y * 100).toFixed(4)),
      label: getDensityCategory(x),
    };
  });
}

function VerticalDashedCursor({ points, height, top = 0 }: CursorProps) {
  const x = points?.[0]?.x;
  if (typeof x !== 'number' || typeof height !== 'number') return null;
  return (
    <line
      x1={x}
      x2={x}
      y1={top}
      y2={height}
      stroke="rgba(248, 248, 248, 0.55)"
      strokeDasharray="3 3"
      strokeWidth={1}
    />
  );
}

export function DensityChartCard({
  initialDensity = 56,
  className = '',
}: DensityChartCardProps) {
  const seedDensity = Math.min(100, Math.max(0, Math.round(initialDensity)));
  const chartData = useMemo(() => buildBellCurveData(), []);
  const [currentDensity, setCurrentDensity] = useState<number>(seedDensity);
  const numberRef = useRef<HTMLSpanElement>(null);
  const animatedValue = useRef({ value: seedDensity });
  const densityCategory = getDensityCategory(currentDensity);

  useGSAP(
    () => {
      if (!numberRef.current) return;
      gsap.to(animatedValue.current, {
        value: currentDensity,
        duration: 0.22,
        ease: 'power3.out',
        onUpdate() {
          if (numberRef.current) {
            numberRef.current.textContent = `${Math.round(animatedValue.current.value)}%`;
          }
        },
      });
    },
    { dependencies: [currentDensity] }
  );

  const handleMouseMove = (state: RechartsMouseState) => {
    const density = state?.activePayload?.[0]?.payload?.density;
    if (typeof density === 'number') setCurrentDensity(density);
  };

  return (
    <div className={`${styles.densityCard} ${className}`}>
      <div className={styles.densityHeader}>
        <p className={styles.microLabel}>EYEBROW DENSITY</p>
        <strong ref={numberRef}>{seedDensity}%</strong>
        <span>{densityCategory}</span>
      </div>
      <div className={styles.chartShell}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 10, bottom: 4, left: 4 }}
            onMouseMove={handleMouseMove as never}
            onMouseLeave={() => {}}
          >
            <defs>
              <linearGradient id="fdColorDensity" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#f8f8f8" stopOpacity={0.38} />
                <stop offset="55%" stopColor="#d9e4e6" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#f8f8f8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="density"
              type="number"
              domain={[0, 100]}
              tickCount={101}
              allowDataOverflow={false}
              hide
            />
            <YAxis type="number" domain={[0, 100]} allowDataOverflow={false} hide />
            <Tooltip
              cursor={<VerticalDashedCursor />}
              content={() => null}
              isAnimationActive={false}
            />
            <Area
              dataKey="percentile"
              type="monotone"
              stroke="rgba(232, 232, 232, 0.72)"
              strokeWidth={1.15}
              fill="url(#fdColorDensity)"
              isAnimationActive={false}
              activeDot={{ r: 4, fill: '#ffffff', stroke: '#ffffff', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.axisLabels}>
        <span>Low density</span>
        <span>Medium density</span>
        <span>High density</span>
      </div>
      <p className={styles.badge}>Your eyebrow density is in the mid 40th percentile</p>
    </div>
  );
}
