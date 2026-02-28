import type { HTMLAttributes, ReactNode } from 'react'
import styles from './GlassCard.module.css'
import { cn } from '../../utils'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: number | string
}

export function GlassCard({ children, padding, className, style, ...rest }: GlassCardProps) {
  return (
    <div
      className={cn(styles.glassCard, className)}
      style={{ padding, ...style }}
      {...rest}
    >
      {children}
    </div>
  )
}
