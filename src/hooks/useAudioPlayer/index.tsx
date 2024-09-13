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
      if (audioRef.current?.paused) {
        audioRef.current.play().then(() => {
          startProgressUpdate()
          setIsPlaying(true)
        })
      } else {
        audioRef.current?.pause()
        stopProgressUpdate()
        setIsPlaying(false)
      }
    } else {
      setIsPlaying(false)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        stopProgressUpdate()
      }

      // Create and play the new audio
      const newAudio = new Audio(audioUrl)
      audioRef.current = newAudio

      newAudio.addEventListener(
        'canplay',
        () => {
          newAudio
            .play()
            .then(() => {
              setCurrentAudio(id)
              setIsPlaying(true)
              setAudioRef(newAudio)
              startProgressUpdate()
              updateBuffer()
            })
            .catch(error => console.error('Error playing audio:', error))
        },
        { once: true }
      )

      newAudio.addEventListener(
        'loadedmetadata',
        () => {
          setDuration(newAudio.duration)
        },
        { once: true }
      )

      newAudio.load() // It resets the audio element to its initial state.
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
