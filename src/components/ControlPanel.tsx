import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Volume2, SkipBack, SkipForward, Play, Pause } from 'lucide-react'

type ControlPanelProps = {
  playing: number | null
  volume: number
  progress: number
  onTogglePlay: () => void
  onVolumeChange: (value: number) => void
  onPrevious: () => void
  onNext: () => void
  currentMatrix: { name: string } | undefined
}

export function ControlPanel({
  playing,
  volume,
  progress,
  onTogglePlay,
  onVolumeChange,
  onPrevious,
  onNext,
  currentMatrix,
}: ControlPanelProps) {
  return (
    <Card className='mb-6'>
      <CardContent className='p-4'>
        <div className='flex items-center justify-between flex-wrap'>
          <div className='flex items-center space-x-4'>
            <Button onClick={onPrevious} variant='outline' size='icon'>
              <SkipBack className='h-4 w-4' />
            </Button>
            <Button onClick={onTogglePlay} size='icon'>
              {playing ? (
                <Pause className='h-4 w-4' />
              ) : (
                <Play className='h-4 w-4' />
              )}
            </Button>
            <Button onClick={onNext} variant='outline' size='icon'>
              <SkipForward className='h-4 w-4' />
            </Button>
          </div>
          <div className='flex items-center space-x-2 flex-grow ml-4'>
            <Volume2 className='h-4 w-4 flex-shrink-0' />
            <Slider
              value={[volume * 100]}
              onValueChange={value => onVolumeChange(value[0] / 100)}
              max={100}
              step={1}
              className='w-full max-w-xs'
            />
          </div>
        </div>
        <div className='mt-4'>
          <p className='text-sm font-medium'>Now Playing:</p>
          <p className='text-lg font-bold'>{currentMatrix?.name}</p>
          <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2'>
            <div
              className='bg-blue-600 h-2.5 rounded-full'
              style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
