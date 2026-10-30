import type { Transition, Variants } from 'motion/react'

// Grid container: staggers the entry of its cards (AC-01.4)
export const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

// Card entry; the stagger is driven by the parent grid (AC-01.4)
export const entryVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

// With reduced motion only fade, never move (AC-08.3)
export const reducedEntryVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

// Hover/focus lift with a slight tilt (AC-07.3)
export const LIFT = { y: -6, rotateX: 2, rotateY: -2, scale: 1.01 }
export const REST = { y: 0, rotateX: 0, rotateY: 0, scale: 1 }
export const liftTransition: Transition = { type: 'spring', stiffness: 300, damping: 22 }
