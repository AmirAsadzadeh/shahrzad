import { server } from './mocks/server'

const mswStateKey = Symbol.for('shahrzad.msw.server.state')
type MswGlobal = typeof globalThis & { [mswStateKey]?: boolean }
const mswGlobal = globalThis as MswGlobal

export async function register() {
  if (process.env.NODE_ENV !== 'development' || mswGlobal[mswStateKey]) {
    return
  }

  server.listen({
    onUnhandledRequest: 'bypass',
  })
  mswGlobal[mswStateKey] = true
}
