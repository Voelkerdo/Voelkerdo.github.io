/** Injected by vite.config.ts at build time (REQ-12, TD-15) */
declare const __SYSTEM_INFO__: {
  versions: { react: string; typescript: string; vite: string; ui5: string; motion: string }
  buildDate: string
  commit: string
}

/** Injected by vite.config.ts at build time (AC-02.7, AC-02.8, TD-16) */
declare const __TRANSPORT_LOG__: {
  transports: import('./data/types.ts').Transport[]
  stats: import('./data/types.ts').BuildStats
}
