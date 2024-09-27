import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt as EventListener
    )

    // Check if the app is already installed or running in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone

    if (!isStandalone) {
      // Set a timeout to check if the event wasn't fired (common on mobile)
      const checkInstallation = setTimeout(() => {
        if (!deferredPrompt) {
          // On mobile, we might still want to show an install hint
          setIsInstallable(true)
        }
      }, 3000)

      return () => {
        clearTimeout(checkInstallation)
        window.removeEventListener(
          'beforeinstallprompt',
          handleBeforeInstallPrompt as EventListener
        )
      }
    }
  }, [])

  const installApp = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false)
      }
      setDeferredPrompt(null)
    } else {
      // For mobile devices where we can't use the prompt
      alert('To install the app, add this page to your home screen.')
    }
  }

  return { isInstallable, installApp }
}
