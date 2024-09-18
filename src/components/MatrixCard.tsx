import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { indexDB } from '@/lib/IndexDb'
import { cn } from '@/lib/utils'
import { Matrix } from '@/types'
import { Download, Heart, Pause, Play } from 'lucide-react'
import { useState } from 'react'

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
  const [isDownloaded, setIsDownloaded] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (matrix.downloaded) {
      return
    }
    setIsDownloading(true)
    try {
      const response = await fetch(matrix.audioSource as string)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const blob = await response.blob()
      await indexDB.saveAudio({
        id: matrix.id,
        audioBlob: blob,
        title: matrix.title,
      })
      setIsDownloaded(true)
    } catch (error) {
      console.error('Error downloading audio:', error)
      alert('Failed to download audio: ' + (error as Error).message)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{matrix.title}</CardTitle>
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={handleDownload}
            variant="ghost"
            size="icon"
            className={cn('flex items-center justify-center', {
              'cursor-none': matrix.downloaded,
            })}
            disabled={matrix.downloaded || isDownloading}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggleFavorite}>
            <Heart className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
          </Button>
        </div>
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
