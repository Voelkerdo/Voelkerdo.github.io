import { m } from 'motion/react'
import type { ReactNode } from 'react'
import { gridVariants } from '../motion/transitions.ts'

export function BentoGrid({ children }: { children: ReactNode }) {
  return (
    <m.div className="bento-grid" variants={gridVariants} initial="hidden" animate="visible">
      {children}
    </m.div>
  )
}
