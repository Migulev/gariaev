import { useRef, useState } from 'react'
import { useProgress } from './useProgress'
import { useSound } from './useSound'

export function useAudioPlayer() {
  const [currentAudio, setCurrentAudio] = useState<number | string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const { isMuted, volume, onVolumeChange, toggleMute } = useSound({
    audioRef,
  })

  const {
    progress,
    duration,
    currentTime,
    buffered,
    onSeek,
    startProgressInterval,
    stopProgressInterval,
    updateBuffered,
    setDuration,
  } = useProgress({ audioRef })

  const togglePlay = (id: number | string, audioUrl: string) => {
    switch (currentAudio) {
      case id:
        setIsPlaying(prev => !prev)
        if (audioRef.current?.paused) {
          audioRef.current.play()
          startProgressInterval()
        } else {
          audioRef.current?.pause()
          stopProgressInterval()
        }
        break

      default: {
        audioRef.current?.pause()
        stopProgressInterval()
        const newAudio = new Audio(audioUrl)
        setCurrentAudio(id)
        audioRef.current = newAudio
        audioRef.current.play()
        setIsPlaying(true)
        newAudio.volume = volume
        startProgressInterval()
        newAudio.onloadedmetadata = () => {
          setDuration(newAudio.duration)
          updateBuffered(true)
        }
        break
      }
    }
  }

  return {
    togglePlay,
    progress,
    volume,
    onVolumeChange,
    toggleMute,
    isMuted,
    currentAudio,
    isPlaying,
    duration,
    currentTime,
    onSeek,
    buffered,
  }
}
