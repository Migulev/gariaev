import { useEffect } from 'react'

import { ControlPanel } from './components/control-panel'
import { DownLoadBar } from './components/DownLoadBar'
import { MatrixPanel } from './components/MatrixPanel'
import { useMatrixStore } from './store/matrix.store'

function App() {
  const fetchMatrices = useMatrixStore((state) => state.fetchMatrices)

  useEffect(() => {
    fetchMatrices()
  }, [fetchMatrices])

  return (
    <div className="no-scrollbar container relative mx-auto h-screen overflow-auto p-2">
      <h1 className="text-3xl font-bold">Матрицы Гаряева</h1>
      <ControlPanel className="mt-6" />
      <MatrixPanel className="mt-6" />

      <DownLoadBar className="absolute right-4 top-4 z-50" />
    </div>
  )
}

export default App
