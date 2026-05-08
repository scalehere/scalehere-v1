'use client'

/**
 * BlueButton — flat electric-blue CTA, replaces V11 GlassButton (B1c).
 *
 * Pure flat fill, no chrome, no glow. Hover triggers:
 *   - dual-text slide (top text translateY(-100%), duplicate slides in from below)
 *   - chevron-double translates 4px right
 *   - 4px electric-blue outline fades in around the pill
 *
 * variant: 'primary' (filled blue) | 'secondary' (outlined transparent)
 * size:    'hero' | 'nav' | 'cta' | 'send' — matches GlassButton size contexts
 * fullWidth, href XOR onClick, disabled, className, aria-label — same shape as GlassButton.
 *
 * Inline state + inline styles for the animation. Tailwind `hover:` modifiers
 * weren't firing reliably in the sandbox iteration; React state is bulletproof.
 *
 * ChevronDouble inlined from public/vectors/chevron-right-double-svgrepo-com.svg
 * with stroke set to currentColor so it inherits the button's text color.
 */

import Link from 'next/link'
import { useState } from 'react'

export type BlueButtonSize = 'hero' | 'nav' | 'cta' | 'send'
export type BlueButtonVariant = 'primary' | 'secondary'

interface SizeSpec {
  fontSize: string
  padding: string
  iconSize: number
  iconStrokeWidth: number
}

const SIZE_STYLES: Record<BlueButtonSize, SizeSpec> = {
  hero: { fontSize: '1rem', padding: '14px 20px', iconSize: 22, iconStrokeWidth: 2.5 },
  // Nav bumped per Tier 1B B3b ("bigger, more identifiable nav button"). Old:
  // 0.8rem / 5px 10px / icon 16. New: 0.95rem / 9px 18px / icon 20 — large
  // enough to read the dual-text slide cleanly without the sub-pixel artifacts
  // that surfaced at 0.8rem.
  nav: { fontSize: '0.95rem', padding: '9px 18px', iconSize: 20, iconStrokeWidth: 2.5 },
  cta: { fontSize: '1rem', padding: '12px 24px', iconSize: 22, iconStrokeWidth: 2.5 },
  send: { fontSize: '0.875rem', padding: '12px 24px', iconSize: 20, iconStrokeWidth: 2.5 },
}

const BLUE = '#3B82F6'
const HOVER_OUTLINE = '0 0 0 4px rgba(59,130,246,0.6)'

interface BlueButtonBaseProps {
  children: React.ReactNode
  className?: string
  'aria-label'?: string
  size?: BlueButtonSize
  variant?: BlueButtonVariant
  fullWidth?: boolean
}

interface BlueButtonLinkProps extends BlueButtonBaseProps {
  href: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  type?: never
  disabled?: never
}

interface BlueButtonButtonProps extends BlueButtonBaseProps {
  href?: never
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

type BlueButtonProps = BlueButtonLinkProps | BlueButtonButtonProps

const EXTERNAL_HREF = /^(https?:|mailto:|tel:|sms:)/i

function ChevronDouble({ size, strokeWidth }: { size: number; strokeWidth: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 17L11 12L6 7M13 17L18 12L13 7" />
    </svg>
  )
}

export function BlueButton(props: BlueButtonProps) {
  const {
    children,
    className,
    'aria-label': ariaLabel,
    size = 'hero',
    variant = 'primary',
    fullWidth,
  } = props

  const [hovered, setHovered] = useState(false)
  const sizeStyle = SIZE_STYLES[size]
  const isDisabled =
    'disabled' in props && (props as BlueButtonButtonProps).disabled === true
  const reactToHover = hovered && !isDisabled

  const containerStyle: React.CSSProperties = {
    display: fullWidth ? 'flex' : 'inline-flex',
    width: fullWidth ? '100%' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: sizeStyle.fontSize,
    lineHeight: 1,
    borderRadius: '9999px',
    padding: sizeStyle.padding,
    color: 'white',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    background:
      variant === 'primary'
        ? BLUE
        : reactToHover
        ? 'rgba(59,130,246,0.10)'
        : 'transparent',
    border: variant === 'secondary' ? `2px solid ${BLUE}` : 'none',
    boxShadow: reactToHover ? HOVER_OUTLINE : '0 0 0 0 transparent',
    opacity: isDisabled ? 0.6 : 1,
    transition: 'all 200ms ease',
    textDecoration: 'none',
  }

  const slideTransform = reactToHover ? 'translateY(-100%)' : 'translateY(0)'

  const inner = (
    <>
      <span
        style={{
          display: 'inline-block',
          overflow: 'hidden',
          height: '1em',
          position: 'relative',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            display: 'block',
            transform: slideTransform,
            transition: 'transform 300ms ease-out',
          }}
        >
          {children}
        </span>
        <span
          style={{
            display: 'block',
            transform: slideTransform,
            transition: 'transform 300ms ease-out',
          }}
        >
          {children}
        </span>
      </span>
      <span
        style={{
          display: 'inline-flex',
          transform: reactToHover ? 'translateX(4px)' : 'translateX(0)',
          transition: 'transform 300ms ease-out',
        }}
      >
        <ChevronDouble
          size={sizeStyle.iconSize}
          strokeWidth={sizeStyle.iconStrokeWidth}
        />
      </span>
    </>
  )

  // Gate hover state to mouse pointers only. Touch devices fire onPointerEnter
  // on tap but no matching onPointerLeave when the finger lifts — this caused
  // a stuck-hover state on the dialog Send button after a failed submission.
  const handlers = {
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse') setHovered(true)
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse') setHovered(false)
    },
  }

  if ('href' in props && props.href) {
    if (EXTERNAL_HREF.test(props.href)) {
      return (
        <a
          href={props.href}
          onClick={props.onClick}
          className={className}
          aria-label={ariaLabel}
          style={containerStyle}
          {...handlers}
        >
          {inner}
        </a>
      )
    }
    return (
      <Link
        href={props.href}
        onClick={props.onClick}
        className={className}
        aria-label={ariaLabel}
        style={containerStyle}
        {...handlers}
      >
        {inner}
      </Link>
    )
  }

  const { onClick, type, disabled } = props as BlueButtonButtonProps
  return (
    <button
      type={type ?? 'button'}
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
      style={containerStyle}
      {...handlers}
    >
      {inner}
    </button>
  )
}
