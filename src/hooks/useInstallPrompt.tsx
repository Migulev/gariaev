import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

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

    // Check if it's iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Check if the app is already installed or running in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone

    if (!isStandalone) {
      // Set a timeout to check if the event wasn't fired (common on mobile)
      const checkInstallation = setTimeout(() => {
        if (!deferredPrompt) {
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
    } else if (isIOS) {
      alert(
        'To install the app on iOS, tap the share button and then "Add to Home Screen".'
      )
    } else {
      alert('To install the app, add this page to your home screen.')
    }
  }

  return { isInstallable, installApp, isIOS }
}
