import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const pkg = (path: string) => JSON.parse(readFileSync(path, 'utf8'))

describe('self-hosted font', () => {
  it('AC-13.1 the font package has the version UI5 uses, so fonts.css stays valid', () => {
    const ours = pkg('package.json').dependencies['@sap-theming/theming-base-content']
    const ui5 = pkg('node_modules/@ui5/webcomponents-theming/package.json').dependencies[
      '@sap-theming/theming-base-content'
    ]
    expect(ours).toBe(ui5)
    // fonts.css is derived from UI5's FontFace.css of exactly this version
    expect(readFileSync('src/styles/fonts.css', 'utf8')).toContain(
      `@sap-theming/theming-base-content ${ours}`,
    )
  })
})
