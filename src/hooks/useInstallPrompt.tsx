import { useState, useEffect } from 'react'

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    const checkInstallation = setTimeout(() => {
      if (!deferredPrompt) {
        setIsInstallable(false)
      }
    }, 1000)

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      )
      clearTimeout(checkInstallation)
    }
  }, [deferredPrompt])

  const installApp = async () => {
    if (deferredPrompt && 'prompt' in deferredPrompt) {
      ;(deferredPrompt as any).prompt()
      const choiceResult = await (deferredPrompt as any).userChoice
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false)
      }
      setDeferredPrompt(null)
    }
  }

  return { isInstallable, installApp }
}
