import { useFavorites } from '@/hooks/useFavorites'
import { usePersist } from '@/hooks/usePersist'
import { cn } from '@/lib/utils'
import { useAudioPlayerStore } from '@/store/audioPlayer'
import { useMatrixStore } from '@/store/matrix'
import { Matrix, Tab } from '@/types'
import { closestCenter, DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { MatrixCard } from './MatrixCard'
import { SortableMatrix } from './SortableMatrix'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

export function TabsGroup({
  className,
  matrices,
}: {
  className?: string
  matrices: Matrix[]
}) {
  const { downloadedMatrices, downloadMatrix } = useMatrixStore()
  const { togglePlay, isPlaying, currentAudio } = useAudioPlayerStore()

  const { favorites, toggleFavorite, handleDragEndFavorites } = useFavorites()
  const [activeTab, setActiveTab] = usePersist<Tab>('activeTab', 'all')
  const handleTabChange = (value: Tab) => {
    setActiveTab(value)
  }

  const filteredMatrices = matrices.filter((matrix) => {
    if (activeTab === 'favorites') {
      return favorites.includes(matrix.id)
    } else if (activeTab === 'downloaded') {
      return matrix.downloaded
    }
    return true
  })

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => handleTabChange(value as Tab)}
      className={cn('w-full', className)}
    >
      <TabsList>
        <TabsTrigger value="all">
          <span className="text-sm font-medium">Все</span>
        </TabsTrigger>
        <TabsTrigger value="favorites">
          <span className="text-sm font-medium">Избранные</span>
        </TabsTrigger>
        <TabsTrigger value="downloaded">
          <span className="text-sm font-medium">Загруженные</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        {filteredMatrices.map((matrix) => (
          <MatrixCard
            key={matrix.id}
            matrix={matrix}
            isPlaying={currentAudio === matrix.id && isPlaying}
            isFavorite={favorites.includes(matrix.id)}
            onTogglePlay={() => togglePlay(matrix.id, matrix.audioSource)}
            onToggleFavorite={() => toggleFavorite(matrix.id)}
            onDownload={() => downloadMatrix(matrix)}
          />
        ))}
      </TabsContent>
      <TabsContent value="favorites">
        {favorites.length === 0 ? (
          <p className="ml-4 mt-10 text-sm font-medium text-muted-foreground">
            нет избранных матриц
          </p>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEndFavorites}
          >
            <SortableContext items={favorites}>
              {favorites.map((id) => {
                const matrix = filteredMatrices.find((m) => m.id === id)
                if (!matrix) return null
                return (
                  <SortableMatrix key={matrix.id} id={matrix.id}>
                    <MatrixCard
                      matrix={matrix}
                      isPlaying={currentAudio === matrix.id && isPlaying}
                      isFavorite={true}
                      onTogglePlay={() =>
                        togglePlay(matrix.id, matrix.audioSource)
                      }
                      onToggleFavorite={() => toggleFavorite(matrix.id)}
                      onDownload={() => downloadMatrix(matrix)}
                    />
                  </SortableMatrix>
                )
              })}
            </SortableContext>
          </DndContext>
        )}
      </TabsContent>
      <TabsContent value="downloaded">
        {downloadedMatrices.length === 0 ? (
          <p className="ml-4 mt-10 text-sm font-medium text-muted-foreground">
            нет загруженных матриц
          </p>
        ) : (
          (() => {
            const firstMatrices = favorites.map((id) =>
              filteredMatrices.find((m) => m.id === id && m.downloaded)
            )
            const secondMatrices = downloadedMatrices.filter(
              (m) => !favorites.includes(m.id)
            )
            const allMatrices = [...firstMatrices, ...secondMatrices]
            return allMatrices.map((matrix) => {
              if (!matrix) return null
              return (
                <MatrixCard
                  key={matrix.id}
                  matrix={matrix}
                  isPlaying={currentAudio === matrix.id && isPlaying}
                  isFavorite={favorites.includes(matrix.id)}
                  onTogglePlay={() => togglePlay(matrix.id, matrix.audioSource)}
                  onToggleFavorite={() => toggleFavorite(matrix.id)}
                  onDownload={() => downloadMatrix(matrix)}
                />
              )
            })
          })()
        )}
      </TabsContent>
    </Tabs>
  )
}
