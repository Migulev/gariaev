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

  const handlePlayNewAudio = (
    id: number | string,
    audioSource: string | Blob
  ) => {
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      stopProgressUpdate()
    }

    let audioUrl: string
    if (audioSource instanceof Blob) {
      audioUrl = URL.createObjectURL(audioSource)
    } else {
      audioUrl = audioSource
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

  useEffect(() => {
    const audio = audioRef.current
    setAudioRef(audio)

    return () => {
      if (audio) {
        audio.pause()
        audio.src = ''
        audio.load()
        if (audio.src.startsWith('blob:')) {
          URL.revokeObjectURL(audio.src)
        }
      }
    }
  }, [currentAudio, setAudioRef])

  const togglePlay = async (
    id: number | string,
    audioSource: string | Blob
  ) => {
    if (currentAudio === id) {
      handlePlaySameAudio()
    } else {
      handlePlayNewAudio(id, audioSource)
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
