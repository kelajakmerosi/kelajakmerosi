import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'
import { cn } from '../../utils'

type Variant = 'primary' | 'ghost' | 'danger' | 'icon' | 'nav'
type Size    = 'sm' | 'md' | 'lg' | 'none'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant
  size?:     Size
  fullWidth?: boolean
  active?:   boolean
  children:  ReactNode
}

const variantMap: Record<Variant, string> = {
  primary: styles.btnPrimary,
  ghost:   styles.btnGhost,
  danger:  styles.btnDanger,
  icon:    styles.btnIcon,
  nav:     styles.btnNav,
}

const sizeMap: Record<Size, string> = {
  sm: styles.btnSm,
  md: '',
  lg: styles.btnLg,
  none: '',
}

export function Button({
  variant   = 'primary',
  size      = 'md',
  fullWidth = false,
  active    = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const safeType = rest.type ?? 'button'

  return (
    <button
      type={safeType}
      className={cn(
        styles.btn,
        variantMap[variant],
        (variant === 'icon' || variant === 'nav') ? '' : sizeMap[size],
        fullWidth && styles.btnFull,
        (variant === 'nav' && active) && styles.btnNavActive,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
