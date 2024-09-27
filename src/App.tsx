import { useEffect } from 'react'

import { ControlPanel } from './components/control-panel'
import { DownloadStatus } from './components/DownloadStatus'
import { MatrixPanel } from './components/MatrixPanel'
import { useMatrix } from './store/matrix'
import { OfflineBar } from './components/OfflineBar'

export const App = () => {
  const fetchMatrices = useMatrix.use.fetchMatrices()

  useEffect(() => {
    fetchMatrices()
  }, [fetchMatrices])

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
