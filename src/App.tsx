import { useState } from 'react'
import { ControlPanel } from './components/ControlPanel'
import { Input } from './components/ui/input'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { type Matrix } from './types'
import { TabsGroup } from './components/TabsGroup'

const matrices: Matrix[] = [
  {
    id: 1,
    name: 'ЖКТ',
    audioUrl: 'https://utfs.io/f/f6b9c11b-d163-4452-8958-aa54b917366b-m9jy.mp3',
  },
  {
    id: 2,
    name: 'Кости и Мышцы',
    audioUrl:
      'https://utfs.io/f/9e57f2cb-1fef-411f-a43c-358cc0cfa25e-y2462f.mp3',
  },
  // { id: 3, name: 'Harmony Matrix', audioUrl: '/path/to/audio3.mp3' },
  // { id: 4, name: 'Balance Matrix', audioUrl: '/path/to/audio4.mp3' },
  // { id: 5, name: 'Vitality Matrix', audioUrl: '/path/to/audio5.mp3' },
]

function App() {
  const [search, setSearch] = useState('')
  const filteredMatrices = matrices.filter(matrix =>
    matrix.name.toLowerCase().includes(search.toLowerCase())
  )

  const {
    currentAudio,
    isPlaying,
    progress,
    togglePlay,
    isMuted,
    toggleMute,
    volume,
    onVolumeChange,
    currentTime,
    duration,
    onSeek,
    buffered,
  } = useAudioPlayer()

  return (
    <div className='container mx-auto p-4 relative'>
      <h1 className='text-3xl font-bold mb-6'>Матрицы Гаряева</h1>

      <ControlPanel
        isPlaying={isPlaying}
        progress={progress}
        onTogglePlay={() =>
          currentAudio &&
          togglePlay(
            currentAudio,
            matrices.find(m => m.id === currentAudio)?.audioUrl || ''
          )
        }
        currentAudio={matrices.find(m => m.id === currentAudio)}
        isMuted={isMuted}
        toggleMute={toggleMute}
        volume={volume}
        onVolumeChange={onVolumeChange}
        currentTime={currentTime}
        duration={duration}
        onSeek={onSeek}
        buffered={buffered}
      />

      <div className='mb-4'>
        <Input
          type='text'
          placeholder='Search matrices...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='max-w-sm'
        />
      </div>
      <TabsGroup
        matrices={filteredMatrices}
        playing={currentAudio}
        togglePlay={togglePlay}
      />
    </div>
  )
}

export default App
