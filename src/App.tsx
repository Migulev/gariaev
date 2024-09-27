import { useEffect } from 'react'

import { ControlPanel } from './components/control-panel'
import { DownloadStatus } from './components/DownloadStatus'
import { MatrixPanel } from './components/MatrixPanel'
import { OfflineBar } from './components/OfflineBar'
import { useMatrix } from './store/matrix'
import { useInstallPrompt } from './hooks/useInstallPrompt'
import { Button } from './components/ui/button'

export const App = () => {
  const fetchMatrices = useMatrix.use.fetchMatrices()

  const { isInstallable, installApp, isIOS } = useInstallPrompt()

  useEffect(() => {
    fetchMatrices()
  }, [fetchMatrices])

  return (
    <div className="no-scrollbar container relative mx-auto h-screen overflow-auto p-2">
      <OfflineBar />

      <div className="mt-2 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Матрицы Гаряева</h1>

        {isInstallable && (
          <Button
            variant="destructive"
            className="max-w-40 whitespace-normal text-xs md:whitespace-nowrap"
            onClick={installApp}
          >
            {isIOS ? 'Добавить на главный экран' : 'Установить приложение'}
          </Button>
        )}
      </div>
      <ControlPanel className="mt-6" />
      <MatrixPanel className="mt-6" />

      <DownloadStatus className="absolute right-4 top-4 z-50" />
    </div>
  )
}
