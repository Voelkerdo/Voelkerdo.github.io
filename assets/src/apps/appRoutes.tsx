import type { ReactElement } from 'react'
import { AppPlaceholder } from './AppPlaceholder.tsx'

export interface AppRoute {
  id: string
  path: string
  title: string
  element: ReactElement
}

// Placeholder apps; replaced by the real apps in T-09 to T-12
export const appRoutes: AppRoute[] = [
  {
    id: 'projects',
    path: '/projects',
    title: 'Projects',
    element: <AppPlaceholder title="Projects" />,
  },
  { id: 'skills', path: '/skills', title: 'Skills', element: <AppPlaceholder title="Skills" /> },
  { id: 'career', path: '/career', title: 'Career', element: <AppPlaceholder title="Career" /> },
  {
    id: 'contact',
    path: '/contact',
    title: 'Contact',
    element: <AppPlaceholder title="Contact" />,
  },
]

export const HOME_TITLE = 'Home'

export function titleForPath(pathname: string): string {
  return appRoutes.find((r) => r.path === pathname)?.title ?? HOME_TITLE
}
