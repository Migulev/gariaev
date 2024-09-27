import { useEffect, useState } from 'react'

import { ControlPanel } from './components/control-panel'
import { DownloadStatus } from './components/DownloadStatus'
import { MatrixPanel } from './components/MatrixPanel'
import { OfflineBar } from './components/OfflineBar'
import { useMatrix } from './store/matrix'

export const App = () => {
  const fetchMatrices = useMatrix.use.fetchMatrices()
  const [isPWAInstalled, setIsPWAInstalled] = useState<boolean | null>(null)

  useEffect(() => {
    fetchMatrices()

    const checkInstallation = async () => {
      const installed = await checkIfPWAInstalled()
      setIsPWAInstalled(installed)
    }

    checkInstallation()
  }, [fetchMatrices])

  console.log('isPWAInstalled', isPWAInstalled)

  return (
    <div className="no-scrollbar container relative mx-auto h-screen overflow-auto p-2">
      <OfflineBar />

      <h1 className="text-3xl font-bold">Матрицы Гаряева</h1>
      <ControlPanel className="mt-6" />
      <MatrixPanel className="mt-6" />

      <DownloadStatus className="absolute right-4 top-4 z-50" />
    </div>
  )
}

interface NavigatorWithRelatedApps extends Navigator {
  getInstalledRelatedApps?: () => Promise<any[]>
}

const checkIfPWAInstalled = async (): Promise<boolean> => {
  const navigatorWithRelatedApps = navigator as NavigatorWithRelatedApps

  if (navigatorWithRelatedApps.getInstalledRelatedApps) {
    try {
      const installedApps =
        await navigatorWithRelatedApps.getInstalledRelatedApps()

      // Log all installed apps
      console.log('Installed apps:', installedApps)

      // Log each app individually
      installedApps.forEach((app, index) => {
        console.log(`App ${index + 1}:`, app)
      })

      return installedApps.some((app) => app.id === 'your-pwa-identifier')
    } catch (error) {
      console.error('Error checking if PWA is installed:', error)
    }
  }

  return false
}
