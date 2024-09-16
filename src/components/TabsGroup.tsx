import { useFavorites } from '@/hooks/useFavorites'
import { cn } from '@/lib/utils'
import { type Matrix } from '@/types'
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
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
  togglePlay: (id: Matrix['id'], audioUrl: Matrix['audioUrl']) => void
  className?: string
}) {
  const { favorites, toggleFavorite, setFavorites } = useFavorites()

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = favorites.indexOf(active.id as number)
      const newIndex = favorites.indexOf(over?.id as number)

      setFavorites(arrayMove(favorites, oldIndex, newIndex))
    }
  }

  return (
    <Tabs defaultValue="all" className={cn('w-full', className)}>
      <TabsList>
        <TabsTrigger value="all">
          <span className="text-sm font-medium">Все</span>
        </TabsTrigger>
        <TabsTrigger value="favorites">
          <span className="text-sm font-medium">Избранные</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        {matrices.map((matrix) => (
          <MatrixCard
            key={matrix.id}
            matrix={matrix}
            isPlaying={playing === matrix.id && isPlaying}
            isFavorite={favorites.includes(matrix.id)}
            onTogglePlay={() => togglePlay(matrix.id, matrix.audioUrl)}
            onToggleFavorite={() => toggleFavorite(matrix.id)}
          />
        ))}
      </TabsContent>
      <TabsContent value="favorites">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
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
                    onTogglePlay={() => togglePlay(matrix.id, matrix.audioUrl)}
                    onToggleFavorite={() => toggleFavorite(matrix.id)}
                  />
                </SortableMatrix>
              )
            })}
          </SortableContext>
        </DndContext>
      </TabsContent>
    </Tabs>
  )
}
