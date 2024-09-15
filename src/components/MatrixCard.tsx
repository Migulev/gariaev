import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Matrix } from '@/types'
import { Heart, Play, Pause } from 'lucide-react'

type MatrixCardProps = {
  matrix: Matrix
  isPlaying: boolean
  isFavorite: boolean
  onTogglePlay: () => void
  onToggleFavorite: () => void
}

export function MatrixCard({
  matrix,
  isPlaying,
  isFavorite,
  onTogglePlay,
  onToggleFavorite,
}: MatrixCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{matrix.name}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onToggleFavorite}>
          <Heart className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
        </Button>
      </CardHeader>
      <CardContent>
        <Button onClick={onTogglePlay} className="mb-2 w-full">
          {isPlaying ? (
            <Pause className="mr-2 h-4 w-4" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
      </CardContent>
    </Card>
  )
}
