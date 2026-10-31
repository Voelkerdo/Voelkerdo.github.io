import { Avatar, ShellBar, ShellBarBranding, Text } from '@ui5/webcomponents-react'
import { lazy, Suspense, useState, type ReactNode } from 'react'
import { profile } from '../data/profile.ts'
import { notifications } from '../data/notifications.ts'

// Rarely used parts load on first use, which keeps the start bundle small on phones (AC-08.2)
const AvatarMenu = lazy(() => import('./AvatarMenu.tsx').then((m) => ({ default: m.AvatarMenu })))
const AboutDialog = lazy(() =>
  import('./AboutDialog.tsx').then((m) => ({ default: m.AboutDialog })),
)
const NotificationsPopover = lazy(() =>
  import('./NotificationsPopover.tsx').then((m) => ({ default: m.NotificationsPopover })),
)
const SettingsDialog = lazy(() =>
  import('./SettingsDialog.tsx').then((m) => ({ default: m.SettingsDialog })),
)
// Only settings start a time travel, so the overlay loads together with them
const TimeTravelOverlay = lazy(() =>
  import('./TimeTravelOverlay.tsx').then((m) => ({ default: m.TimeTravelOverlay })),
)

const initials = profile.name
  .split(' ')
  .map((part) => part[0])
  .join('')

const PAGE_TITLE = 'Overview'

// Single page (D-8): the branding scrolls back to the top instead of navigating (AC-06.11)
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpener, setMenuOpener] = useState<HTMLElement | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [notificationsOpener, setNotificationsOpener] = useState<HTMLElement | null>(null)
  // Only for this visit: opening the list clears the badge, closing it marks the items read (AC-10.3)
  const [badgeVisible, setBadgeVisible] = useState(true)
  const [notificationsRead, setNotificationsRead] = useState(false)
  // Mounted on first use and kept afterwards, so closing animations still run
  const [menuUsed, setMenuUsed] = useState(false)
  const [settingsUsed, setSettingsUsed] = useState(false)
  const [aboutUsed, setAboutUsed] = useState(false)
  const [notificationsUsed, setNotificationsUsed] = useState(false)

  return (
    <div className="app-shell">
      <ShellBar
        className="app-shellbar"
        branding={
          <ShellBarBranding
            logo={<span className="shell-logo" aria-hidden="true" data-initials={initials} />}
            // Same as the visible text (the initials are CSS content), WCAG 2.5.3
            accessibleName={profile.name}
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
        onProfileClick={(event) => {
          setMenuUsed(true)
          setMenuOpener(event.detail.targetRef)
        }}
        showNotifications
        notificationsCount={badgeVisible ? String(notifications.length) : undefined}
        onNotificationsClick={(event) => {
          setNotificationsUsed(true)
          setNotificationsOpener(event.detail.targetRef)
          setBadgeVisible(false)
        }}
      />

      <Suspense fallback={null}>
        {menuUsed && (
          <AvatarMenu
            opener={menuOpener}
            initials={initials}
            onClose={() => setMenuOpener(null)}
            onAction={(action) => {
              if (action === 'settings') {
                setSettingsUsed(true)
                setSettingsOpen(true)
              }
              if (action === 'about') {
                setAboutUsed(true)
                setAboutOpen(true)
              }
            }}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {settingsUsed && (
          <>
            <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
            {/* After the dialog, so it opens above it in the top layer (TD-14) */}
            <TimeTravelOverlay />
          </>
        )}

        {aboutUsed && <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />}

        {notificationsUsed && (
          <NotificationsPopover
            opener={notificationsOpener}
            read={notificationsRead}
            onClose={() => {
              setNotificationsOpener(null)
              setNotificationsRead(true)
            }}
          />
        )}
      </Suspense>

      <div className="app-content">{children}</div>
    </div>
  )
}
