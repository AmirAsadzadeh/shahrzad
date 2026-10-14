'use client'

import { useEffect, useState } from 'react'

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
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    startWorker().then(() => {
      if (isMounted) setIsReady(true)
    })

    return () => {
      isMounted = false
    }
  }, [])

  if (!isReady) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>Initializing Mock Server...</h2>
        <p>Please wait while the service worker starts.</p>
      </div>
    )
  }

  return <>{children}</>
}
