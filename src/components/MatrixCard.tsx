import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useHandleDownload } from '@/hooks/useHandleDownload'
import { cn } from '@/lib/utils'
import { Matrix } from '@/types'
import { Download, Heart, Pause, Play, Trash2 } from 'lucide-react'
import { Progress } from './ui/progress'

type MatrixCardProps = {
  matrix: Matrix
  isPlaying: boolean
  isFavorite: boolean
  onTogglePlay: () => void
  onToggleFavorite: () => void
  // onDeleteDownload: () => void
}

export function MatrixCard({
  matrix,
  isPlaying,
  isFavorite,
  onTogglePlay,
  onToggleFavorite,
  // onDeleteDownload,
}: MatrixCardProps) {
  const { isDownloading, downloadProgress, handleDownload } =
    useHandleDownload()

  const onDeleteDownload = () => {
    console.log('delete download')
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{matrix.title}</CardTitle>
        <div className="flex items-center justify-center gap-2">
          {matrix.downloaded ? (
            <Button
              onClick={onDeleteDownload}
              variant="ghost"
              size="icon"
              className="flex items-center justify-center hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => handleDownload(matrix)}
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
        {isDownloading && (
          <Progress value={downloadProgress} className="mb-2" />
        )}
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
