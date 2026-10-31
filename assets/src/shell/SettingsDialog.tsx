import {
  List,
  ListItemGroup,
  ListItemStandard,
  UserSettingsAppearanceView,
  UserSettingsAppearanceViewGroup,
  UserSettingsAppearanceViewItem,
  UserSettingsDialog,
  UserSettingsItem,
  UserSettingsView,
} from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/palette.js'
import '@ui5/webcomponents-icons/dist/it-system.js'
import { build, hosting, techStack, type SystemEntry } from '../data/system.ts'
import { findTheme, THEME_GROUPS, themeLabel, themes } from '../data/themes.ts'
import type { ThemeGroup } from '../data/types.ts'
import { useThemeMode } from './useThemeMode.ts'

interface Props {
  open: boolean
  onClose: () => void
}

const GROUP_COLORS: Record<ThemeGroup, 'Accent1' | 'Accent6' | 'Accent10'> = {
  Today: 'Accent1',
  'SAP Fiori': 'Accent6',
  'SAP GUI': 'Accent10',
}

// Fiori settings dialog with Appearance (AC-11.1); a click applies the theme right away (AC-11.4)
export function SettingsDialog({ open, onClose }: Props) {
  const { theme, selectTheme } = useThemeMode()
  const groups = THEME_GROUPS.filter((group) => themes.some((t) => t.group === group))

  return (
    <UserSettingsDialog open={open} headerText="Settings" onClose={onClose} data-testid="settings">
      <UserSettingsItem text="Appearance" headerText="Appearance" icon="palette" selected>
        <UserSettingsAppearanceView
          onSelectionChange={(event) => {
            const selected = findTheme(event.detail.item.itemKey)
            if (selected) selectTheme(selected.id)
          }}
        >
          {groups.map((group) => (
            <UserSettingsAppearanceViewGroup key={group} headerText={group}>
              {themes
                .filter((t) => t.group === group)
                .map((t) => (
                  <UserSettingsAppearanceViewItem
                    key={t.id}
                    itemKey={t.id}
                    text={themeLabel(t)}
                    icon="palette"
                    colorScheme={GROUP_COLORS[group]}
                    selected={t.id === theme}
                    data-theme-id={t.id}
                  />
                ))}
            </UserSettingsAppearanceViewGroup>
          ))}
        </UserSettingsAppearanceView>
      </UserSettingsItem>
      <UserSettingsItem text="System" headerText="System" icon="it-system">
        <UserSettingsView>
          <SystemInfo />
        </UserSettingsView>
      </UserSettingsItem>
    </UserSettingsDialog>
  )
}

function SystemGroup({ title, entries }: { title: string; entries: SystemEntry[] }) {
  return (
    <ListItemGroup headerText={title} data-system-group={title}>
      {entries.map((entry) => (
        <ListItemStandard
          key={entry.label}
          type="Inactive"
          text={entry.label}
          additionalText={entry.value}
          data-system-entry={entry.label}
        />
      ))}
    </ListItemGroup>
  )
}

// Read-only system information (REQ-12); the theme follows the time travel (AC-12.2)
function SystemInfo() {
  const { resolvedTheme } = useThemeMode()
  const themeValue = `${resolvedTheme.name} · ${resolvedTheme.ui5Theme}${resolvedTheme.emulated ? ' (recreated)' : ''}`
  return (
    <List className="system-info" accessibleName="System information" data-testid="system-info">
      <SystemGroup title="Tech Stack" entries={techStack} />
      <SystemGroup title="Hosting" entries={hosting} />
      <SystemGroup title="Build" entries={build} />
      <SystemGroup title="Theme" entries={[{ label: 'Active theme', value: themeValue }]} />
    </List>
  )
}
