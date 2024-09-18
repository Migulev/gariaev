import { useFavorites } from '@/hooks/useFavorites'
import { usePersist } from '@/hooks/usePersist'
import { cn } from '@/lib/utils'
import { Tab, type Matrix } from '@/types'
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { MatrixCard } from './MatrixCard'
import { SortableMatrix } from './SortableMatrix'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

export function TabsGroup({
  matrices,
  playing,
  togglePlay,
  className,
  isPlaying,
}: {
  matrices: Matrix[]
  playing: number | string | null
  isPlaying: boolean
  togglePlay: (id: Matrix['id'], audioSource: Matrix['audioSource']) => void
  className?: string
}) {
  const { favorites, toggleFavorite, setFavorites } = useFavorites()
  const [activeTab, setActiveTab] = usePersist<Tab>('activeTab', 'all')
  const handleTabChange = (value: Tab) => {
    setActiveTab(value)
  }
  const downloadedMatrices = matrices.filter((matrix) => matrix.downloaded)

  const handleDragEndFavorites = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = favorites.indexOf(active.id as Matrix['id'])
      const newIndex = favorites.indexOf(over?.id as Matrix['id'])
      setFavorites(arrayMove(favorites, oldIndex, newIndex))
    }
  }

  return (
    <Tabs
      // !todo implement logic
      value={matrices.length > 0 ? activeTab : 'all'}
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
            matrices.find((m) => m.id === id),
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
              />
            )
          })
        })()}
      </TabsContent>
    </Tabs>
  )
}
