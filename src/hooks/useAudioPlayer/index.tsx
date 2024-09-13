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
    if (currentAudio === id) {
      setIsPlaying(prev => !prev)
      if (audioRef.current?.paused) {
        audioRef.current.play().then(() => startProgressUpdate())
      } else {
        audioRef.current?.pause()
        stopProgressUpdate()
      }
    } else {
      // Stop the current audio if it's playing
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        stopProgressUpdate()
      }

      // Create and play the new audio
      const newAudio = new Audio(audioUrl)
      audioRef.current = newAudio

      setCurrentAudio(id)
      setIsPlaying(true)
      startProgressUpdate(true)
      updateBuffer(true)
      setAudioRef(newAudio)

      newAudio.addEventListener('loadedmetadata', () => {
        setDuration(newAudio.duration)
      })

      newAudio
        .play()
        .then(() => {
          newAudio.volume = volume
        })
        .catch(error => {
          console.error('Error playing audio:', error)
          setIsPlaying(false)
        })
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
