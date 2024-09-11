import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { formatTime } from '@/lib/utils'
import { Pause, Play, Volume2, VolumeX, Clock, RotateCcw } from 'lucide-react'
import { useState, useRef } from 'react'

type ControlPanelProps = {
  isPlaying: boolean
  currentAudio: { name: string } | undefined
  progress: number
  volume: number
  isMuted: boolean
  onTogglePlay: () => void
  toggleMute: () => void
  onVolumeChange: (newVolume: number) => void
  currentTime: number
  duration: number
  onSeek: (time: number) => void
  buffered: number // Add this new prop
}

export function ControlPanel({
  isPlaying,
  currentAudio,
  progress,
  volume,
  isMuted,
  onTogglePlay,
  toggleMute,
  onVolumeChange,
  currentTime,
  duration,
  onSeek,
  buffered, // Add this new prop
}: ControlPanelProps) {
  const [isReverseTime, setIsReverseTime] = useState(false)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const toggleTimeDisplay = () => setIsReverseTime(!isReverseTime)

  const displayTime = isReverseTime
    ? formatTime(duration - currentTime)
    : formatTime(currentTime)
  const displayDuration = isReverseTime ? '0:00' : formatTime(duration)

  const handleProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect()
      const clickPosition = event.clientX - rect.left
      const percentClicked = clickPosition / rect.width
      const newTime = percentClicked * duration
      onSeek(newTime)
    }
  }

  return (
    <Card className='mb-6'>
      <CardContent className='p-4'>
        <div className='flex items-center justify-between flex-wrap'>
          <div className='flex items-center space-x-4'>
            <Button onClick={onTogglePlay} size='icon' disabled={!currentAudio}>
              {isPlaying ? (
                <Pause className='h-4 w-4' />
              ) : (
                <Play className='h-4 w-4' />
              )}
            </Button>
          </div>
          <div className='flex items-center space-x-2 flex-grow ml-4'>
            <Button onClick={toggleMute} size='icon' variant='ghost'>
              {volume === 0 || isMuted ? (
                <VolumeX className='h-4 w-4 flex-shrink-0' />
              ) : (
                <Volume2 className='h-4 w-4 flex-shrink-0' />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              onValueChange={value => onVolumeChange(value[0] / 100)}
              max={100}
              step={1}
              className='w-full max-w-xs'
            />
          </div>
        </div>
        <div className='mt-4'>
          <div className='flex justify-between items-center'>
            <p className='text-sm font-medium'>Сейчас играет:</p>
            <Button onClick={toggleTimeDisplay} size='icon' variant='ghost'>
              {isReverseTime ? (
                <RotateCcw className='h-4 w-4' />
              ) : (
                <Clock className='h-4 w-4' />
              )}
            </Button>
          </div>
          <p className='text-lg font-bold'>{currentAudio?.name}</p>
          <div
            ref={progressBarRef}
            className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2 cursor-pointer relative'
            onClick={handleProgressBarClick}>
            {/* Buffered progress bar */}
            <div
              className='absolute bg-gray-400 h-2.5 rounded-full'
              style={{ width: `${buffered}%` }}></div>
            {/* Playback progress bar */}
            <div
              className='absolute bg-progressBar h-2.5 rounded-full'
              style={{ width: `${progress}%` }}></div>
          </div>
          <div className='flex justify-between mt-1 text-sm'>
            <span>{displayTime}</span>
            <span>{displayDuration}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
