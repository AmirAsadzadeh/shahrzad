import { setupWorker } from 'msw/browser'
import { appHandlers } from './appHandlers'

export const worker = setupWorker(...appHandlers)
