import { useEffect, useState } from 'react'
import { ControlPanel } from './components/ControlPanel'
import { Input } from './components/ui/input'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { type Matrix } from './types'
import { TabsGroup } from './components/TabsGroup'
import { supabase } from './lib/supabase'

function App() {
  const [matrices, setMatrices] = useState<Matrix[]>([])

  useEffect(() => {
    const receiveMetadata = async () => {
      const { data: mp3_metadata } = await supabase
        .from('mp3_metadata')
        .select('*')
        .throwOnError()

      if (mp3_metadata) {
        setMatrices(mp3_metadata as Matrix[])
      }
    }

    receiveMetadata()
  }, [])

  const [search, setSearch] = useState('')
  const filteredMatrices = matrices
    .sort((a, b) => a.title.localeCompare(b.title))
    .filter((matrix) =>
      matrix.title.toLowerCase().includes(search.toLowerCase()),
    )

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
    <div className="no-scrollbar container relative mx-auto h-screen overflow-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Матрицы Гаряева TEST</h1>
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
            matrices.find((m) => m.id === currentAudio)?.audioUrl || '',
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
        matrices={filteredMatrices}
        playing={currentAudio}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        className="mt-4"
      />
    </div>
  )
}

export default App
