import { useState, useEffect, useRef } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { MatrixCard } from '@/components/MatrixCard'
import { ControlPanel } from '@/components/ControlPanel'

const matrices = [
  { id: 1, name: 'Healing Matrix', audioUrl: '/path/to/audio1.mp3' },
  { id: 2, name: 'Regeneration Matrix', audioUrl: '/path/to/audio2.mp3' },
  { id: 3, name: 'Harmony Matrix', audioUrl: '/path/to/audio3.mp3' },
  { id: 4, name: 'Balance Matrix', audioUrl: '/path/to/audio4.mp3' },
  { id: 5, name: 'Vitality Matrix', audioUrl: '/path/to/audio5.mp3' },
]

export function Home() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [playing, setPlaying] = useState<number | null>(null)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [volume, setVolume] = useState(1)
  const [progress, setProgress] = useState(0)
  const [search, setSearch] = useState('')
  const progressInterval = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const storedFavorites = localStorage.getItem('gariaevFavorites')
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('gariaevFavorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    if (audio) {
      audio.volume = volume
    }
  }, [volume, audio])

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    )
  }

  const togglePlay = (id: number, audioUrl: string) => {
    if (playing === id) {
      audio?.pause()
      setPlaying(null)
      clearInterval(progressInterval.current)
    } else {
      audio?.pause()
      const newAudio = new Audio(audioUrl)
      newAudio.volume = volume
      newAudio.play()
      setAudio(newAudio)
      setPlaying(id)
      setProgress(0)
      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (newAudio.duration > 0) {
            return (newAudio.currentTime / newAudio.duration) * 100
          }
          return prev
        })
      }, 1000)
    }
  }

  const playPrevious = () => {
    if (playing !== null) {
      const currentIndex = matrices.findIndex(m => m.id === playing)
      const previousIndex =
        (currentIndex - 1 + matrices.length) % matrices.length
      togglePlay(matrices[previousIndex].id, matrices[previousIndex].audioUrl)
    }
  }

  const playNext = () => {
    if (playing !== null) {
      const currentIndex = matrices.findIndex(m => m.id === playing)
      const nextIndex = (currentIndex + 1) % matrices.length
      togglePlay(matrices[nextIndex].id, matrices[nextIndex].audioUrl)
    }
  }

  const filteredMatrices = matrices.filter(matrix =>
    matrix.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='container mx-auto p-4 relative'>
      <h1 className='text-3xl font-bold mb-6'>Gariaev Matrix Audio</h1>

      {playing !== null && (
        <ControlPanel
          playing={playing}
          volume={volume}
          progress={progress}
          onTogglePlay={() =>
            playing &&
            togglePlay(
              playing,
              matrices.find(m => m.id === playing)?.audioUrl || ''
            )
          }
          onVolumeChange={setVolume}
          onPrevious={playPrevious}
          onNext={playNext}
          currentMatrix={matrices.find(m => m.id === playing)}
        />
      )}

      <div className='mb-4'>
        <Input
          type='text'
          placeholder='Search matrices...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='max-w-sm'
        />
      </div>

      <Tabs defaultValue='all' className='w-full'>
        <TabsList>
          <TabsTrigger value='all'>All Matrices</TabsTrigger>
          <TabsTrigger value='favorites'>Favorites</TabsTrigger>
        </TabsList>
        <TabsContent value='all'>
          {filteredMatrices.map(matrix => (
            <MatrixCard
              key={matrix.id}
              matrix={matrix}
              isPlaying={playing === matrix.id}
              isFavorite={favorites.includes(matrix.id)}
              onTogglePlay={() => togglePlay(matrix.id, matrix.audioUrl)}
              onToggleFavorite={() => toggleFavorite(matrix.id)}
            />
          ))}
        </TabsContent>
        <TabsContent value='favorites'>
          {filteredMatrices
            .filter(matrix => favorites.includes(matrix.id))
            .map(matrix => (
              <MatrixCard
                key={matrix.id}
                matrix={matrix}
                isPlaying={playing === matrix.id}
                isFavorite={true}
                onTogglePlay={() => togglePlay(matrix.id, matrix.audioUrl)}
                onToggleFavorite={() => toggleFavorite(matrix.id)}
              />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
