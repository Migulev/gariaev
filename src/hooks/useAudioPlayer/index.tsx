import { useEffect, useRef, useState } from 'react'
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
    startBufferUpdate,
    startProgressUpdate,
    stopProgressUpdate,
    setDuration,
    setAudioRef,
  } = useProgress()

  const handlePlaySameAudio = () => {
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
  }

  const handlePlayNewAudio = (id: number | string, audioUrl: string) => {
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      stopProgressUpdate()
    }

    const newAudio = new Audio(audioUrl)
    audioRef.current = newAudio

    setCurrentAudio(id)
    newAudio.addEventListener(
      'canplay',
      () => {
        newAudio.play().then(() => {
          setIsPlaying(true)
          startProgressUpdate()
          startBufferUpdate()
        })
      },
      { once: true },
    )

    newAudio.addEventListener(
      'loadedmetadata',
      () => {
        setDuration(newAudio.duration)
      },
      { once: true },
    )

    newAudio.load() // It resets the audio element to its initial state.
  }

  useEffect(() => {
    const audio = audioRef.current
    setAudioRef(audio)

    return () => {
      if (audio) {
        audio.pause()
        audio.src = ''
        audio.load()
      }
    }
  }, [currentAudio, setAudioRef])

  const togglePlay = (id: number | string, audioUrl: string) => {
    if (currentAudio === id) {
      handlePlaySameAudio()
    } else {
      handlePlayNewAudio(id, audioUrl)
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
