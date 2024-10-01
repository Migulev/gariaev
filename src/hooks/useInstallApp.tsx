import { useState, useEffect, useRef } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function useInstallApp() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      deferredPromptRef.current = e
      setIsInstallable(true)
    }

    const checkInstallation = async () => {
      if ('getInstalledRelatedApps' in navigator) {
        console.log('Checking installation')
        const installedApps = await (navigator as any).getInstalledRelatedApps()
        if (installedApps.length > 0) {
          console.log('Installed apps:', installedApps)
          setIsInstallable(false)
          return
        }
      }
      setIsInstallable(!deferredPromptRef.current)
    }

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt as EventListener
    )

    // Check after a short delay
    setTimeout(checkInstallation, 3000)

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt as EventListener
      )
    }
  }, [])

  useEffect(() => {
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)
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
