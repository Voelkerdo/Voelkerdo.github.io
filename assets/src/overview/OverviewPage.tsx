import '@ui5/webcomponents-icons/dist/chain-link.js'
import '@ui5/webcomponents-icons/dist/email.js'
import '@ui5/webcomponents-icons/dist/history.js'
import '@ui5/webcomponents-icons/dist/source-code.js'
import '@ui5/webcomponents-icons/dist/wrench.js'
import { buildCards } from '../data/cards.ts'
import { AnimatedCard } from './AnimatedCard.tsx'
import { BentoGrid } from './BentoGrid.tsx'
import { Hero } from './Hero.tsx'

const cards = buildCards()

export function OverviewPage() {
  return (
    <main className="overview-page">
      <Hero />
      {/* Card content follows in T-17 to T-20 */}
      <BentoGrid>
        {cards.map((def) => (
          <AnimatedCard key={def.id} def={def} />
        ))}
      </BentoGrid>
    </main>
  )
}
