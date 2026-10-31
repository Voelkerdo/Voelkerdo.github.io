import { Button, UserMenu, UserMenuAccount, UserMenuItem } from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/hint.js'
import '@ui5/webcomponents-icons/dist/action-settings.js'
import { profile } from '../data/profile.ts'

export type AvatarMenuAction = 'settings' | 'about'

interface Props {
  opener: HTMLElement | null
  initials: string
  onClose: () => void
  onAction: (action: AvatarMenuAction) => void
}

// User menu like the Fiori launchpad, with "Visit GitHub" instead of "Sign Out" (AC-06.9, AC-06.10)
export function AvatarMenu({ opener, initials, onClose, onAction }: Props) {
  return (
    <UserMenu
      open={opener !== null}
      opener={opener}
      onClose={onClose}
      accounts={
        <UserMenuAccount
          titleText={profile.name}
          subtitleText={profile.tagline}
          avatarInitials={initials}
          avatarColorScheme="Accent1"
          selected
        />
      }
      onItemClick={(event) => {
        const action = event.detail.item.dataset.action as AvatarMenuAction | undefined
        if (action) onAction(action)
        onClose()
      }}
      footer={
        <Button
          design="Transparent"
          onClick={() => window.open(profile.githubUrl, '_blank', 'noopener')}
        >
          Visit GitHub
        </Button>
      }
    >
      {/* Theme choice lives in Settings › Appearance, as in the Fiori launchpad (D-15) */}
      <UserMenuItem data-action="settings" icon="action-settings" text="Settings" />
      <UserMenuItem data-action="about" icon="hint" text="About" />
    </UserMenu>
  )
}
