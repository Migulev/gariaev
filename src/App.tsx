import { useEffect, useState } from 'react'
import { ControlPanel } from './components/ControlPanel'
import { TabsGroup } from './components/TabsGroup'
import { Input } from './components/ui/input'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { useMatrixStore } from './store/matrix.store'
import { Button } from './components/ui/button'
import { X } from 'lucide-react'

function App() {
  const {
    matrices,
    fetchMatrices,
    isDownloading,
    downloadProgress,
    matrixIsDownloading,
    // cancelDownload, // Add this line
  } = useMatrixStore()
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchMatrices()
  }, [fetchMatrices])

  const {
    currentAudio,
    isPlaying,
    volume,
    isMuted,
    progress,
    buffered,
    currentTime,
    duration,
    togglePlay,
    toggleMute,
    onVolumeChange,
    onSeek,
  } = useAudioPlayer()

  return (
    <div className="no-scrollbar container relative mx-auto h-screen overflow-auto p-2">
      {isDownloading && (
        <div className="absolute right-4 top-4 z-50 w-64 rounded-md bg-white p-4 shadow-md">
          <div className="flex items-end justify-between">
            <p className="text-sm font-bold">скачивается</p>
            <Button variant="destructive" size="icon">
              <X size={16} />
            </Button>
          </div>
          <p className="mt-2 w-44 text-sm">
            {matrixIsDownloading?.title}: {downloadProgress}%
          </p>
        </div>
      )}

      <h1 className="mb-6 text-3xl font-bold">Матрицы Гаряева</h1>
      <ControlPanel
        currentAudio={matrices.find((m) => m.id === currentAudio)}
        isPlaying={isPlaying}
        progress={progress}
        volume={volume}
        isMuted={isMuted}
        duration={duration}
        buffered={buffered}
        currentTime={currentTime}
        toggleMute={toggleMute}
        onVolumeChange={onVolumeChange}
        onSeek={onSeek}
        onTogglePlay={() =>
          currentAudio &&
          togglePlay(
            currentAudio,
            matrices.find((m) => m.id === currentAudio)?.audioSource || ''
          )
        }
      />

      <Input
        type="text"
        placeholder="поиск матрицы..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <TabsGroup
        playing={currentAudio}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        className="mt-4"
      />
    </div>
  )
}

export default App
