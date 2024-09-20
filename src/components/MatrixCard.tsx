import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useMatrixStore } from '@/store/matrix'
import { Matrix } from '@/types'
import { Download, Heart, Pause, Play, Trash2 } from 'lucide-react'
import { Progress } from './ui/progress'
import { useAudioPlayerStore } from '@/store/audioPlayer'

type MatrixCardProps = {
  matrix: Matrix
  isFavorite: boolean
  isPlaying: boolean
  onToggleFavorite: () => void
}

export function MatrixCard({
  matrix,
  isFavorite,
  onToggleFavorite,
  isPlaying,
}: MatrixCardProps) {
  const deleteMatrix = useMatrixStore((state) => state.deleteMatrix)
  const downloadMatrix = useMatrixStore((state) => state.downloadMatrix)
  const isDownloading = useMatrixStore((state) => state.isDownloading)
  const downloadProgress = useMatrixStore((state) => state.downloadProgress)
  const matrixIsDownloading = useMatrixStore(
    (state) => state.matrixIsDownloading
  )

  const togglePlay = useAudioPlayerStore((state) => state.togglePlay)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{matrix.title}</CardTitle>
        <div className="flex items-center justify-center gap-2">
          {matrix.downloaded ? (
            <Button
              onClick={() => deleteMatrix(matrix)}
              variant="ghost"
              size="icon"
              className="flex items-center justify-center hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => downloadMatrix(matrix)}
              variant="ghost"
              size="icon"
              className={cn('flex items-center justify-center', {
                'cursor-none': matrix.downloaded,
              })}
              disabled={matrix.downloaded || isDownloading}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onToggleFavorite}>
            <Heart className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {matrixIsDownloading?.id === matrix.id && (
          <Progress value={downloadProgress} className="mb-2" />
        )}
        <Button
          onClick={() => togglePlay(matrix.id, matrix.audioSource)}
          className="mb-2 w-full"
        >
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
