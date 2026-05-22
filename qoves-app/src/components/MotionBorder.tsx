'use client';

import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

/**
 * MotionBorder
 * -----------
 * Renders a single SVG overlay that covers its parent container.
 * Draws a mathematically calculated, pixel-perfect "H" shape:
 *   - Border hugs each image with uniform padding
 *   - Two horizontal bridges connect the images (upper + lower)
 *   - Fully responsive and immune to layout shifts or measurement delays.
 *
 * CRITICAL SYNC: The layout fractions here MUST match the CSS grid in
 * PersonalizedPlan.module.scss exactly:
 *   grid-template-columns: 30% 40% 30%
 *   → imageFraction = 0.30, gapFraction = 0.40
 *
 * Animates two tiny square dots exactly 50% apart along the path.
 */

interface MotionBorderProps {
  borderRadius?: number;
  dotColor?: string;
  dotSize?: number;
  duration?: number;
  trackColor?: string;
  trackWidth?: number;
  /** Uniform padding between the border path and the image edges */
  borderPadding?: number;
  /** Fraction from top/bottom where the bridges sit (0–0.5) */
  bridgePosition?: number;
  /** Radius of the curves where bridges meet image edges */
  bridgeCurveRadius?: number;
  /** Fixed pixel distance between the two bridges. Overrides bridgePosition. */
  bridgeGap?: number;
  /** Fraction of parent width each image occupies. MUST match CSS grid. */
  imageFraction?: number;
  /** Fraction of parent width for the center gap. MUST match CSS grid. */
  gapFraction?: number;
}

const MotionBorder: React.FC<MotionBorderProps> = ({
  borderRadius = 18,
  dotColor = '#385740a5',
  dotSize = 6,
  duration = 12,
  trackColor = '#3d574073',
  trackWidth = 1.5,
  borderPadding = 6,
  bridgePosition = 0.38,
  bridgeCurveRadius = 10,
  bridgeGap,
  imageFraction = 0.45,
  gapFraction = 0.10,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dot1Ref = useRef<SVGRectElement>(null);
  const dot2Ref = useRef<SVGRectElement>(null);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [pathD, setPathD] = useState('');

  // Observe parent size
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !svg.parentElement) return;
    const parent = svg.parentElement;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ w: width, h: height });
      }
    });

    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    setSize({ w: rect.width, h: rect.height });
    return () => ro.disconnect();
  }, []);

  // Compute the H path using exact mathematical formula of the CSS grid layout
  useLayoutEffect(() => {
    if (size.w === 0 || size.h === 0) return;

    // Skip path generation on mobile layouts
    if (size.w <= 768) {
      setPathD('');
      return;
    }

    const W = size.w;
    const H = size.h;
    const pad = borderPadding;

    // Concentric radius for the border: R_concentric = R_inner + Padding
    const r = borderRadius + pad;
    const cr = bridgeCurveRadius;

    // ═══ SYNCHRONIZED LAYOUT MATH ═══
    // CSS grid: grid-template-columns: 30% 40% 30%
    // Parent has padding: 0, so SVG inset:0 aligns with grid edges exactly.
    const imgW = W * imageFraction;   // Each image width = 30% of parent
    const gapW = W * gapFraction;     // Center gap = 40% of parent
    const imgH = imgW * (4 / 3);      // aspect-ratio: 3 / 4

    // Vertically center the image region within the container
    const imgTop = (H - imgH) / 2;

    // Left image occupies [0, imgW] horizontally
    const lL = 0 - pad;              // left edge of border (outside image)
    const lR = imgW + pad;           // right edge of border (outside image)
    const lT = imgTop - pad;         // top edge of border
    const lB = imgTop + imgH + pad;  // bottom edge of border

    // Right image occupies [imgW + gapW, W] horizontally
    const rL = imgW + gapW - pad;    // left edge of border
    const rR = W + pad;              // right edge of border
    const rT = imgTop - pad;         // top edge of border
    const rB = imgTop + imgH + pad;  // bottom edge of border

    // Bridge Y positions
    let upperBridgeY: number;
    let lowerBridgeY: number;
    if (bridgeGap != null) {
      // Fixed pixel gap: center the two bridges vertically
      const centerY = (lT + lB) / 2;
      upperBridgeY = centerY - bridgeGap / 2;
      lowerBridgeY = centerY + bridgeGap / 2;
    } else {
      // Fraction-based positioning
      upperBridgeY = lT + (lB - lT) * bridgePosition;
      lowerBridgeY = lB - (lB - lT) * bridgePosition;
    }

    // Build the perfect symmetric "H" path — clockwise, starting top-left of left image
    const d = [
      // ═══ TOP-LEFT CORNER of left image ═══
      `M ${lL + r},${lT}`,

      // ─── Top edge of left image → right ───
      `L ${lR - r},${lT}`,
      `Q ${lR},${lT} ${lR},${lT + r}`,

      // ─── Right edge of left image → down to upper bridge ───
      `L ${lR},${upperBridgeY - cr}`,

      // ─── Curve into upper bridge (going right) ───
      `Q ${lR},${upperBridgeY} ${lR + cr},${upperBridgeY}`,

      // ─── Across upper bridge ───
      `L ${rL - cr},${upperBridgeY}`,

      // ─── Curve arriving at right image (going up) ───
      `Q ${rL},${upperBridgeY} ${rL},${upperBridgeY - cr}`,

      // ─── Left edge of right image → up to top ───
      `L ${rL},${rT + r}`,
      `Q ${rL},${rT} ${rL + r},${rT}`,

      // ─── Top edge of right image → right ───
      `L ${rR - r},${rT}`,
      `Q ${rR},${rT} ${rR},${rT + r}`,

      // ─── Right edge of right image → all the way down ───
      `L ${rR},${rB - r}`,
      `Q ${rR},${rB} ${rR - r},${rB}`,

      // ─── Bottom edge of right image → left ───
      `L ${rL + r},${rB}`,
      `Q ${rL},${rB} ${rL},${rB - r}`,

      // ─── Left edge of right image → up to lower bridge ───
      `L ${rL},${lowerBridgeY + cr}`,

      // ─── Curve into lower bridge (going left) ───
      `Q ${rL},${lowerBridgeY} ${rL - cr},${lowerBridgeY}`,

      // ─── Across lower bridge ───
      `L ${lR + cr},${lowerBridgeY}`,

      // ─── Curve arriving at left image (going down) ───
      `Q ${lR},${lowerBridgeY} ${lR},${lowerBridgeY + cr}`,

      // ─── Right edge of left image → down to bottom ───
      `L ${lR},${lB - r}`,
      `Q ${lR},${lB} ${lR - r},${lB}`,

      // ─── Bottom edge of left image → left ───
      `L ${lL + r},${lB}`,
      `Q ${lL},${lB} ${lL},${lB - r}`,

      // ─── Left edge of left image → up to top ───
      `L ${lL},${lT + r}`,
      `Q ${lL},${lT} ${lL + r},${lT}`,

      'Z',
    ].join(' ');

    setPathD(d);
  }, [size, borderRadius, borderPadding, bridgePosition, bridgeCurveRadius, bridgeGap, imageFraction, gapFraction]);

  // Animate the two square dots along the path
  useGSAP(
    () => {
      if (!pathD || !pathRef.current || !dot1Ref.current || !dot2Ref.current) return;

      const path = pathRef.current;
      const pathLength = path.getTotalLength();
      const halfDot = dotSize / 2;

      const tl = gsap.timeline({ repeat: -1, ease: 'none' });

      tl.to(
        {},
        {
          duration,
          onUpdate: function () {
            const progress = this.progress();

            // Dot 1
            const p1 = path.getPointAtLength(progress * pathLength);
            gsap.set(dot1Ref.current, { x: p1.x - halfDot, y: p1.y - halfDot });

            // Dot 2 — exactly 50% offset (mirrored)
            const progress2 = (progress + 0.5) % 1;
            const p2 = path.getPointAtLength(progress2 * pathLength);
            gsap.set(dot2Ref.current, { x: p2.x - halfDot, y: p2.y - halfDot });
          },
        }
      );
    },
    { dependencies: [pathD, duration, dotSize] }
  );

  return (
    // aria-hidden: this is a purely decorative animated border overlay
    <svg
      ref={svgRef}
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        display: (size.w === 0 || size.w <= 768) ? 'none' : 'block',
        overflow: 'visible',
      }}
    >
      {pathD && (
        <>
          {/* Track path */}
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke={trackColor}
            strokeWidth={trackWidth}
          />

          {/* Lead square dot 1 */}
          <rect
            ref={dot1Ref}
            width={dotSize}
            height={dotSize}
            fill={dotColor}
          />

          {/* Lead square dot 2 — 50% offset, exact mirror */}
          <rect
            ref={dot2Ref}
            width={dotSize}
            height={dotSize}
            fill={dotColor}
          />
        </>
      )}
    </svg>
  );
};

export default MotionBorder;
