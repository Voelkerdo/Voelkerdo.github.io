import { Avatar } from '@ui5/webcomponents-react'
import { profile } from '../../data/profile.ts'

const initials = profile.name
  .split(' ')
  .map((part) => part[0])
  .join('')

export function ProfileCard() {
  return (
    <div className="profile-card">
      <Avatar
        size="L"
        initials={initials}
        colorScheme="Accent1"
        accessibleName={profile.name}
        className="profile-avatar"
      />
      <div>
        {/* The page heading lives inside the card – there is no content outside cards (AC-01.7) */}
        <h1 className="profile-name">{profile.name}</h1>
        <p className="profile-tagline">{profile.tagline}</p>
      </div>
    </div>
  )
}
