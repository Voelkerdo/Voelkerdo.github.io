import { Bar, Button, Dialog, Link, Text } from '@ui5/webcomponents-react'
import { profile } from '../data/profile.ts'

export function AboutDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog
      open={open}
      headerText="About this site"
      onClose={onClose}
      footer={
        <Bar
          endContent={
            <Button design="Emphasized" onClick={onClose}>
              Close
            </Button>
          }
        />
      }
    >
      <div className="about-content">
        <Text>Built with React &amp; SAP UI5 Web Components.</Text>
        <Link href={profile.siteRepoUrl} target="_blank">
          View the source on GitHub
        </Link>
      </div>
    </Dialog>
  )
}
