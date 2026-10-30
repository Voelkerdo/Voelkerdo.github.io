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
import '@ui5/webcomponents-icons/dist/nav-back.js'
import '@ui5/webcomponents-icons/dist/hint.js'
import '@ui5/webcomponents-icons/dist/dark-mode.js'
import '@ui5/webcomponents-icons/dist/light-mode.js'
import { useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { HOME_TITLE, titleForPath } from '../apps/appRoutes.tsx'
import { profile } from '../data/profile.ts'
import { AboutDialog } from './AboutDialog.tsx'
import { useThemeMode } from './useThemeMode.ts'

const initials = profile.name
  .split(' ')
  .map((part) => part[0])
  .join('')

export function LaunchpadShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { mode, toggleMode } = useThemeMode()
  const [menuOpener, setMenuOpener] = useState<HTMLElement | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)

  const title = titleForPath(pathname)
  const inApp = title !== HOME_TITLE
  // Navigate to "/" instead of history.back() so it also works after a direct link (AC-06.7)
  const goHome = () => navigate('/')

  return (
    <div className="launchpad-shell">
      <ShellBar
        className="launchpad-shellbar"
        startButton={
          inApp ? (
            <Button icon="nav-back" design="Transparent" accessibleName="Back" onClick={goHome} />
          ) : undefined
        }
        branding={
          <ShellBarBranding
            logo={
              <span className="shell-logo" aria-hidden="true">
                {initials}
              </span>
            }
            accessibleName={`${profile.name} – Home`}
            onClick={goHome}
          >
            {profile.name}
          </ShellBarBranding>
        }
        content={
          <Text className="shell-app-title" data-testid="app-title">
            {title}
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

      <div className="launchpad-content">{children}</div>
    </div>
  )
}
