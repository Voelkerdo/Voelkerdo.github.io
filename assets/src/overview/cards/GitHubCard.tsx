import { Button, Text } from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/source-code.js'
import { profile } from '../../data/profile.ts'

export function GitHubCard() {
  return (
    <div className="github-card">
      <Text>Explore my repositories and follow my work on GitHub.</Text>
      <Button
        design="Emphasized"
        icon="source-code"
        data-testid="github-follow"
        onClick={() => window.open(profile.githubUrl, '_blank', 'noopener')}
      >
        Follow @{profile.githubUsername}
      </Button>
    </div>
  )
}
