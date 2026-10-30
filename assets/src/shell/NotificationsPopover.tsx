import { NotificationList, NotificationListItem, ResponsivePopover } from '@ui5/webcomponents-react'
import { notifications } from '../data/notifications.ts'

interface Props {
  opener: HTMLElement | null
  /** Unread items are shown bold, as in Fiori */
  read: boolean
  onClose: () => void
}

// Responsive: a popover on wide screens, a full-screen dialog on phones (AC-10.5)
export function NotificationsPopover({ opener, read, onClose }: Props) {
  return (
    <ResponsivePopover
      open={opener !== null}
      opener={opener}
      headerText="Notifications"
      placement="Bottom"
      horizontalAlign="End"
      onClose={onClose}
      data-testid="notifications"
    >
      <NotificationList
        className="notification-list"
        onItemClick={(event) => {
          const href = event.detail.item.dataset.href
          if (href) window.open(href, '_blank', 'noopener')
        }}
      >
        {notifications.map((n) => (
          <NotificationListItem
            key={n.id}
            data-notification-id={n.id}
            data-href={n.href}
            titleText={n.title}
            importance={n.importance === 'High' ? 'Important' : 'Standard'}
            footnotes={<span>{n.time}</span>}
            read={read}
          >
            {n.text}
          </NotificationListItem>
        ))}
      </NotificationList>
    </ResponsivePopover>
  )
}
