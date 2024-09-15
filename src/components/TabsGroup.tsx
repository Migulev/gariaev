import { useFavorites } from '@/hooks/useFavorites'
import { cn } from '@/lib/utils'
import { type Matrix } from '@/types'
import { MatrixCard } from './MatrixCard'
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
  const { favorites, toggleFavorite } = useFavorites()

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
        {favorites.map((id) => {
          const matrix = matrices.find((m) => m.id === id)
          if (!matrix) return null
          return (
            <MatrixCard
              key={matrix.id}
              matrix={matrix}
              isPlaying={playing === matrix.id && isPlaying}
              isFavorite={true}
              onTogglePlay={() => togglePlay(matrix.id, matrix.audioUrl)}
              onToggleFavorite={() => toggleFavorite(matrix.id)}
            />
          )
        })}
      </TabsContent>
    </Tabs>
  )
}
