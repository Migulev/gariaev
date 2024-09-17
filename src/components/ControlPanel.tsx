import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { usePersist } from '@/hooks/usePersist'
import { useProgressBarInteraction } from '@/hooks/useProgressBarInteraction'
import { formatTime } from '@/lib/utils'
import { Clock, Pause, Play, Volume2, VolumeX } from 'lucide-react'

type ControlPanelProps = {
  isPlaying: boolean
  currentAudio: { title: string } | undefined
  progress: number
  volume: number
  isMuted: boolean
  currentTime: number
  duration: number
  buffered: number
  onTogglePlay: () => void
  toggleMute: () => void
  onVolumeChange: (newVolume: number) => void
  onSeek: (time: number) => void
}

export function ControlPanel({
  isPlaying,
  currentAudio,
  progress,
  volume,
  isMuted,
  currentTime,
  duration,
  buffered,
  onTogglePlay,
  toggleMute,
  onVolumeChange,
  onSeek,
}: ControlPanelProps) {
  const [isReverseTime, setIsReverseTime] = usePersist('isReverseTime', false)
  const toggleTimeDisplay = () => {
    setIsReverseTime(!isReverseTime)
  }

  const straightTime =
    !isNaN(currentTime) && isFinite(currentTime)
      ? formatTime(currentTime)
      : '00:00'
  const reverseTime =
    !isNaN(duration - currentTime) && isFinite(duration - currentTime)
      ? '-' + formatTime(duration - currentTime)
      : '-00:00'
  const currentDuration = isReverseTime ? reverseTime : straightTime
  const totalDuration =
    !isNaN(duration) && isFinite(duration) ? formatTime(duration) : '00:00'

  const { progressBarRef, handleMouseDown, handleTouchStart } =
    useProgressBarInteraction({ duration, onSeek })

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={onTogglePlay} size="icon" disabled={!currentAudio}>
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="ml-4 flex flex-grow items-center space-x-2">
            <Button onClick={toggleMute} size="icon" variant="ghost">
              {volume === 0 || isMuted ? (
                <VolumeX className="h-4 w-4 flex-shrink-0" />
              ) : (
                <Volume2 className="h-4 w-4 flex-shrink-0" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={(value) => onVolumeChange(value[0] / 100)}
              max={100}
              step={1}
              className="w-full max-w-xs"
            />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Сейчас играет:</p>
            <Button onClick={toggleTimeDisplay} size="icon" variant="ghost">
              <Clock className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-lg font-bold">{currentAudio?.title}</p>
          <div
            ref={progressBarRef}
            className="relative mt-2 h-2.5 w-full cursor-pointer rounded-full bg-gray-200 dark:bg-gray-700"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* Buffered progress bar */}
            <div
              className="absolute h-2.5 rounded-full bg-gray-400"
              style={{ width: `${buffered}%` }}
            ></div>
            {/* Playback progress bar */}
            <div
              className="bg-progressBar absolute h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            >
              {/* Rounded point at the end of progress bar */}
              <div className="bg-progressBar absolute right-0 top-1/2 h-5 w-5 -translate-y-1/2 translate-x-1/2 transform rounded-full border-2 border-white"></div>
            </div>
          </div>
          <div className="mt-1 flex justify-between text-sm">
            <span>{currentDuration}</span>
            <span>{totalDuration}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
