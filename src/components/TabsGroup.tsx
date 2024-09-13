import { useFavorites } from '@/hooks/useFavorites'
import { MatrixCard } from './MatrixCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { type Matrix } from '@/types'
import { cn } from '@/lib/utils'

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
  togglePlay: (id: number, audioUrl: string) => void
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
        {favorites
          .map((id) => {
            const foundMatrix = matrices.find((matrix) => matrix.id === id)
            return foundMatrix
          })
          .map((matrix) => {
            return (
              matrix && (
                <MatrixCard
                  key={matrix.id}
                  matrix={matrix}
                  isPlaying={playing === matrix.id && isPlaying}
                  isFavorite={true}
                  onTogglePlay={() => togglePlay(matrix.id, matrix.audioUrl)}
                  onToggleFavorite={() => toggleFavorite(matrix.id)}
                />
              )
            )
          })}
      </TabsContent>
    </Tabs>
  )
}
