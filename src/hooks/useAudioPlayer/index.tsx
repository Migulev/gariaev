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
    buffered,
    duration,
    currentTime,
    onSeek,
    startProgressUpdate,
    stopProgressUpdate,
    updateBuffer,
    setDuration,
    setAudioRef,
  } = useProgress()

  const togglePlay = (id: number | string, audioUrl: string) => {
    switch (currentAudio) {
      case id:
        setIsPlaying(prev => !prev)
        if (audioRef.current?.paused) {
          audioRef.current.play()
          startProgressUpdate()
        } else {
          audioRef.current?.pause()
          stopProgressUpdate()
        }
        break

      default: {
        audioRef.current?.pause()
        stopProgressUpdate()
        const newAudio = new Audio(audioUrl)
        audioRef.current = newAudio

        newAudio.oncanplay = () => {
          newAudio.play()
          newAudio.volume = volume
          setCurrentAudio(id)
          setIsPlaying(true)
          startProgressUpdate(true)
          updateBuffer(true)
          setDuration(newAudio.duration)
          setAudioRef(newAudio)
        }
        break
      }
    }
  }

  return {
    isPlaying,
    currentAudio,
    progress,
    buffered,
    volume,
    isMuted,
    duration,
    currentTime,
    togglePlay,
    toggleMute,
    onVolumeChange,
    onSeek,
  }
}
