import {
  UserSettingsAppearanceView,
  UserSettingsAppearanceViewGroup,
  UserSettingsAppearanceViewItem,
  UserSettingsDialog,
  UserSettingsItem,
} from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/palette.js'
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
    </UserSettingsDialog>
  )
}
