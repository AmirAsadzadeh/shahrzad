'use client'

import { useEffect, useState } from 'react'
import { AppBootstrapError, AppBootstrapLoader } from '@/shared/ui/AppBootstrap'

let workerStartPromise: Promise<void> | null = null

const startWorker = () => {
  if (!workerStartPromise) {
    workerStartPromise = import('../mocks/browser')
      .then(({ worker }) => worker.start({ onUnhandledRequest: 'bypass' }))
      .then(() => undefined)
  }

  return workerStartPromise
}

export default function MSWProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let isMounted = true

    startWorker()
      .then(() => {
        if (isMounted) setStatus('ready')
      })
      .catch(() => {
        workerStartPromise = null
        if (isMounted) setStatus('error')
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (status === 'loading') return <AppBootstrapLoader />
  if (status === 'error') return <AppBootstrapError onRetry={() => window.location.reload()} />

  return <>{children}</>
}
