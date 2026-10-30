import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { gridVariants } from '../motion/transitions.ts'

export function BentoGrid({ children }: { children: ReactNode }) {
  return (
    <motion.div className="bento-grid" variants={gridVariants} initial="hidden" animate="visible">
      {children}
    </motion.div>
  )
}
