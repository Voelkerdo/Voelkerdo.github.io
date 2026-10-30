import {
  Avatar,
  Button,
  ShellBar,
  ShellBarBranding,
  Text,
  UserMenu,
  UserMenuAccount,
  UserMenuItem,
} from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/hint.js'
import '@ui5/webcomponents-icons/dist/dark-mode.js'
import '@ui5/webcomponents-icons/dist/light-mode.js'
import { useState, type ReactNode } from 'react'
import { profile } from '../data/profile.ts'
import { AboutDialog } from './AboutDialog.tsx'
import { useThemeMode } from './useThemeMode.ts'

const initials = profile.name
  .split(' ')
  .map((part) => part[0])
  .join('')

const PAGE_TITLE = 'Overview'

// Single page (D-8): the branding scrolls back to the top instead of navigating (AC-06.11)
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

export function AppShell({ children }: { children: ReactNode }) {
  const { mode, toggleMode } = useThemeMode()
  const [menuOpener, setMenuOpener] = useState<HTMLElement | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)

  return (
    <div className="app-shell">
      <ShellBar
        className="app-shellbar"
        branding={
          <ShellBarBranding
            logo={
              <span className="shell-logo" aria-hidden="true">
                {initials}
              </span>
            }
            accessibleName={`${profile.name} – scroll to top`}
            onClick={scrollToTop}
          >
            {profile.name}
          </ShellBarBranding>
        }
        content={
          <Text className="shell-page-title" data-testid="page-title">
            {PAGE_TITLE}
          </Text>
        }
        profile={
          <Avatar
            initials={initials}
            colorScheme="Accent1"
            accessibleName="Open user menu"
            data-testid="shell-avatar"
          />
        }
        onProfileClick={(event) => setMenuOpener(event.detail.targetRef)}
      />

      <UserMenu
        open={menuOpener !== null}
        opener={menuOpener}
        onClose={() => setMenuOpener(null)}
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
          const action = event.detail.item.dataset.action
          if (action === 'toggle-theme') toggleMode()
          if (action === 'about') setAboutOpen(true)
          setMenuOpener(null)
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
        <UserMenuItem
          data-action="toggle-theme"
          icon={mode === 'dark' ? 'light-mode' : 'dark-mode'}
          text={mode === 'dark' ? 'Light mode' : 'Dark mode'}
        />
        <UserMenuItem data-action="about" icon="hint" text="About" />
      </UserMenu>

      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />

      <div className="app-content">{children}</div>
    </div>
  )
}
