'use client'

import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'
import type { SVGProps } from 'react'

export interface GaugeProps extends Omit<SVGProps<SVGSVGElement>, 'className'> {
  value: number
  max?: number
  size?: number | string
  gapPercent?: number
  strokeWidth?: number
  showValue?: boolean
  primary?: 'danger' | 'warning' | 'success' | 'info' | string
  secondary?: string
  transition?: { length?: number; delay?: number }
  className?:
    | string
    | {
        svgClassName?: string
        primaryClassName?: string
        secondaryClassName?: string
        textClassName?: string
      }
}

// Speedometer: 270° arc, gap at the bottom
// Start: bottom-left (225° clockwise from top = -135° from top)
// End:   bottom-right (135° clockwise from top)
const START_DEG = -135
const SWEEP_DEG = 270

function toRad(deg: number) {
  return ((deg - 90) * Math.PI) / 180
}

function pt(cx: number, cy: number, r: number, deg: number) {
  return {
    x: parseFloat((cx + r * Math.cos(toRad(deg))).toFixed(4)),
    y: parseFloat((cy + r * Math.sin(toRad(deg))).toFixed(4)),
  }
}

function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const sweep = to - from
  if (Math.abs(sweep) < 0.01) return ''
  const s = pt(cx, cy, r, from)
  const e = pt(cx, cy, r, to)
  const large = sweep > 180 ? 1 : 0
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`
}

const PRESETS: Record<string, string> = {
  danger: '#dc2626',
  warning: '#f59e0b',
  info: '#3b82f6',
  success: '#22c55e',
}

function resolveColor(c?: string): string {
  if (!c) return '#22c55e'
  return PRESETS[c] ?? c
}

/**
 * Speedometer gauge: 270° arc from bottom-left to bottom-right.
 * Two arcs — primary (progress) + secondary (background track).
 */
export function Gauge({
  value,
  max = 100,
  size = '100%',
  strokeWidth = 10,
  showValue = false,
  primary,
  secondary,
  transition = { length: 1100, delay: 0 },
  className,
  ...props
}: GaugeProps) {
  const primaryRef = useRef<SVGPathElement>(null)
  const rafRef = useRef<number>(0)

  const vb = 100
  const cx = vb / 2
  const cy = vb / 2
  const r = vb / 2 - strokeWidth / 2 - 1

  const trackPath = arc(cx, cy, r, START_DEG, START_DEG + SWEEP_DEG)

  const primaryColor = resolveColor(primary)
  const secondaryColor = secondary ?? '#e5e7eb'

  // Solid lighter shade for gradient start (not transparent)
  const LIGHT_SHADES: Record<string, string> = {
    '#22c55e': '#86efac', // green-300
    '#dc2626': '#fca5a5', // red-300
    '#f59e0b': '#fcd34d', // amber-300
    '#3b82f6': '#93c5fd', // blue-300
  }
  const lightColor = LIGHT_SHADES[primaryColor] ?? primaryColor + 'aa'

  const gradId = `sg-${Math.abs(Math.round(value * 100))}`

  useEffect(() => {
    const el = primaryRef.current
    if (!el) return

    const target = Math.min(1, Math.max(0, value / max))
    let start = 0
    let t0 = 0
    const dur = transition?.length ?? 1100

    cancelAnimationFrame(rafRef.current)

    const step = (now: number) => {
      if (!t0) t0 = now
      const p = Math.min(1, (now - t0) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      const f = start + (target - start) * eased
      const endDeg = START_DEG + SWEEP_DEG * f
      const d = arc(cx, cy, r, START_DEG, endDeg)
      if (d) el.setAttribute('d', d)
      else el.removeAttribute('d')
      if (p < 1) rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, max, transition?.length, cx, cy, r])

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${vb} ${vb}`}
      width={size}
      height={size}
      fill="none"
      style={{ userSelect: 'none', overflow: 'visible' }}
      className={cn(
        typeof className === 'string'
          ? className
          : (className as { svgClassName?: string })?.svgClassName
      )}
      {...props}
    >
      <defs>
        <linearGradient
          id={gradId}
          gradientUnits="userSpaceOnUse"
          x1={pt(cx, cy, r, START_DEG).x}
          y1={pt(cx, cy, r, START_DEG).y}
          x2={pt(cx, cy, r, START_DEG + SWEEP_DEG * 0.85).x}
          y2={pt(cx, cy, r, START_DEG + SWEEP_DEG * 0.85).y}
        >
          <stop offset="0%" stopColor={lightColor} />
          <stop offset="100%" stopColor={primaryColor} />
        </linearGradient>
      </defs>

      {/* Background (secondary) arc — full 270° */}
      <path
        d={trackPath}
        stroke={secondaryColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={cn(
          typeof className === 'object' &&
            (className as { secondaryClassName?: string })?.secondaryClassName
        )}
      />

      {/* Progress (primary) arc — animated */}
      <path
        ref={primaryRef}
        stroke={`url(#${gradId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={cn(
          typeof className === 'object' &&
            (className as { primaryClassName?: string })?.primaryClassName
        )}
      />

      {showValue && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          alignmentBaseline="central"
          fill="currentColor"
          fontSize={28}
          fontWeight={900}
          letterSpacing="-1"
          className={cn(
            typeof className === 'object' &&
              (className as { textClassName?: string })?.textClassName
          )}
        >
          {Math.round(value)}
        </text>
      )}
    </svg>
  )
}
