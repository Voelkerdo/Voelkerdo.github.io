import { Button } from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/source-code.js'
import { profile } from '../data/profile.ts'

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      {/* Plain h1: the gradient text cannot reach into the shadow DOM of UI5 Title */}
      <h1 id="hero-title" className="hero-title">
        {profile.name}
      </h1>
      <p className="hero-tagline">{profile.tagline}</p>
      <Button
        design="Emphasized"
        icon="source-code"
        data-testid="hero-cta"
        onClick={() => window.open(profile.githubUrl, '_blank', 'noopener')}
      >
        View my GitHub
      </Button>
    </section>
  )
}
