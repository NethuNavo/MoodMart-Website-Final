import * as React from 'react'

export const Play = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M5 3v18l15-9-15-9z" />
  </svg>
)

export const Pause = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
  </svg>
)

export const RotateCcw = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <path d="M21 12a9 9 0 1 1-3-6.7L21 6" />
    <path d="M21 3v6h-6" />
  </svg>
)

export default { Play, Pause, RotateCcw }
