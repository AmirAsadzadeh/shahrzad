import { setupServer } from 'msw/node'
import { appHandlers } from './appHandlers'

export const server = setupServer(...appHandlers)
