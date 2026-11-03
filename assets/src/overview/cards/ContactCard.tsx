import { List, ListItemStandard } from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/business-card.js'
import '@ui5/webcomponents-icons/dist/email.js'
import '@ui5/webcomponents-icons/dist/meal.js'
import '@ui5/webcomponents-icons/dist/source-code.js'
import { contactChannels } from '../../data/contact.ts'
import type { ContactChannel } from '../../data/types.ts'

/** Readable form of a channel URL, e.g. "github.com/Voelkerdo" */
function displayUrl(url: string): string {
  return url
    .replace(/^mailto:/, '')
    .replace(/^https?:\/\/(www\.)?/, '')
    .replace(/\/$/, '')
}

function openChannel(channel: ContactChannel) {
  if (channel.url.startsWith('mailto:')) {
    window.location.href = channel.url
  } else {
    window.open(channel.url, '_blank', 'noopener')
  }
}

// No contact form – there is no backend (AC-05.2)
export function ContactCard() {
  return (
    <List className="contact-list" accessibleName="Contact channels">
      {contactChannels.map((channel) => (
        <ListItemStandard
          key={channel.id}
          data-channel-id={channel.id}
          className={channel.primary ? 'contact-primary' : undefined}
          type="Active"
          icon={channel.icon}
          text={channel.label}
          description={channel.description ?? displayUrl(channel.url)}
          additionalText={channel.primary ? 'Follow me' : undefined}
          onClick={() => openChannel(channel)}
        />
      ))}
    </List>
  )
}
