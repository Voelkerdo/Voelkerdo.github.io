import type { BuildStats, Transport } from './types.ts'

// Built from git and the specs at build time (TD-16); newest transport first (AC-02.7)
export const transports: Transport[] = __TRANSPORT_LOG__.transports

export const buildStats: BuildStats = __TRANSPORT_LOG__.stats
