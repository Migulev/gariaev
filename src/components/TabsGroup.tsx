import { useFavorites } from '@/hooks/useFavorites'
import { usePersist } from '@/hooks/usePersist'
import { cn } from '@/lib/utils'
import { Tab, type Matrix } from '@/types'
import { closestCenter, DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { MatrixCard } from './MatrixCard'
import { SortableMatrix } from './SortableMatrix'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { useMatrixStore } from '@/store/matrix.store'

export function TabsGroup({
  playing,
  togglePlay,
  className,
  isPlaying,
}: {
  playing: number | string | null
  isPlaying: boolean
  togglePlay: (id: Matrix['id'], audioSource: Matrix['audioSource']) => void
  className?: string
}) {
  const { matrices, downloadedMatrices, downloadMatrix } = useMatrixStore()

  const { favorites, toggleFavorite, handleDragEndFavorites } = useFavorites()
  const [activeTab, setActiveTab] = usePersist<Tab>('activeTab', 'all')
  const handleTabChange = (value: Tab) => {
    setActiveTab(value)
  }

  const tabValueLogic = () => {
    if (activeTab === 'favorites') {
      return favorites.length > 0 ? activeTab : 'all'
    }
    if (activeTab === 'downloaded') {
      return downloadedMatrices.length > 0 ? activeTab : 'all'
    }
    return 'all'
  }

  return (
    <Tabs
      value={tabValueLogic()}
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
        {matrices.map((matrix) => (
          <MatrixCard
            key={matrix.id}
            matrix={matrix}
            isPlaying={playing === matrix.id && isPlaying}
            isFavorite={favorites.includes(matrix.id)}
            onTogglePlay={() => togglePlay(matrix.id, matrix.audioSource)}
            onToggleFavorite={() => toggleFavorite(matrix.id)}
            onDownload={() => downloadMatrix(matrix)}
          />
        ))}
      </TabsContent>
      <TabsContent value="favorites">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEndFavorites}
        >
          <SortableContext items={favorites}>
            {favorites.map((id) => {
              const matrix = matrices.find((m) => m.id === id)
              if (!matrix) return null
              return (
                <SortableMatrix key={matrix.id} id={matrix.id}>
                  <MatrixCard
                    matrix={matrix}
                    isPlaying={playing === matrix.id && isPlaying}
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
      </TabsContent>
      <TabsContent value="downloaded">
        {(() => {
          const firstMatrices = favorites.map((id) =>
            matrices.find((m) => m.id === id && m.downloaded),
          )
          const secondMatrices = downloadedMatrices.filter(
            (m) => !favorites.includes(m.id),
          )
          const allMatrices = [...firstMatrices, ...secondMatrices]
          return allMatrices.map((matrix) => {
            if (!matrix) return null
            return (
              <MatrixCard
                key={matrix.id}
                matrix={matrix}
                isPlaying={playing === matrix.id && isPlaying}
                isFavorite={favorites.includes(matrix.id)}
                onTogglePlay={() => togglePlay(matrix.id, matrix.audioSource)}
                onToggleFavorite={() => toggleFavorite(matrix.id)}
                onDownload={() => downloadMatrix(matrix)}
              />
            )
          })
        })()}
      </TabsContent>
    </Tabs>
  )
}
