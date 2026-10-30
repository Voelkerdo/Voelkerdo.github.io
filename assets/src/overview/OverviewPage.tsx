import '@ui5/webcomponents-icons/dist/chain-link.js'
import '@ui5/webcomponents-icons/dist/email.js'
import '@ui5/webcomponents-icons/dist/history.js'
import '@ui5/webcomponents-icons/dist/person-placeholder.js'
import '@ui5/webcomponents-icons/dist/source-code.js'
import '@ui5/webcomponents-icons/dist/wrench.js'
import type { ReactNode } from 'react'
import { buildCards } from '../data/cards.ts'
import { AnimatedCard } from './AnimatedCard.tsx'
import { BentoGrid } from './BentoGrid.tsx'
import { ProfileCard } from './cards/ProfileCard.tsx'
import { ProjectsCard } from './cards/ProjectsCard.tsx'

const cards = buildCards()

// Card content by card id; the remaining cards are filled in T-17 to T-20
const content: Record<string, ReactNode> = {
  about: <ProfileCard />,
  projects: <ProjectsCard />,
}

export function OverviewPage() {
  return (
    <main className="overview-page">
      <BentoGrid>
        {cards.map((def) => (
          <AnimatedCard key={def.id} def={def}>
            {content[def.id]}
          </AnimatedCard>
        ))}
      </BentoGrid>
    </main>
  )
}
