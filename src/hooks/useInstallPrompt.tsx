import { useState, useEffect, useRef } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function useInstallPrompt() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      deferredPromptRef.current = e
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

    const checkInstallation = setTimeout(() => {
      if (!deferredPromptRef.current) {
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
  }, [])

  const installApp = async () => {
    if (deferredPromptRef.current) {
      await deferredPromptRef.current.prompt()
      const choiceResult = await deferredPromptRef.current.userChoice
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false)
      }
      deferredPromptRef.current = null
    } else if (isIOS) {
      alert(
        'Чтобы установить приложение на iOS, нажмите на кнопку "Поделиться" и добавьте его на главный экран. "На экран Домой". To install the app on iOS, tap the share button and then "Add to Home Screen".'
      )
    } else {
      alert(
        'Чтобы установить приложение, добавьте эту страницу на главный экран.'
      )
    }
  }

  return { isInstallable, installApp, isIOS }
}
