import { useCallback, useEffect, useRef, useState } from 'react'
import { usePersist } from './usePersist'

export function useAudioPlayer() {
  const [currentAudio, setCurrentAudio] = useState<number | string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const [volume, setVolume] = usePersist('audioVolume', 1, {
    converter: (value: string) => parseFloat(value),
  })

  const [progress, setProgress] = useState(0)
  const progressIntervalRef = useRef<number | null>(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [buffered, setBuffered] = useState(0)

  const onVolumeChange = (newVolume: number) => setVolume(newVolume)

  const toggleMute = useCallback(() => {
    if (volume > 0) {
      setIsMuted(prev => !prev)
      if (audioRef.current) {
        audioRef.current.muted = !isMuted
      }
    }
  }, [isMuted, volume])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime
      const duration = audioRef.current.duration
      setCurrentTime(currentTime)
      setDuration(duration)
      if (duration > 0) setProgress((currentTime / duration) * 100)
      else setProgress(0)
    }
  }, [])

  const startProgressInterval = useCallback(() => {
    updateProgress()
    progressIntervalRef.current = window.setInterval(updateProgress, 1000)
  }, [updateProgress])

  const stopProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => stopProgressInterval()
  }, [stopProgressInterval])

  const updateBuffered = useCallback((isNewAudio: boolean = false) => {
    if (isNewAudio) setBuffered(0)
    if (audioRef.current) {
      const bufferedRanges = audioRef.current.buffered
      if (bufferedRanges.length > 0) {
        const bufferedEnd = bufferedRanges.end(bufferedRanges.length - 1)
        setBuffered((bufferedEnd / audioRef.current.duration) * 100)
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current
      const handleProgress = () => updateBuffered()
      audio.addEventListener('progress', handleProgress)

      return () => audio.removeEventListener('progress', handleProgress)
    }
  }, [currentAudio, updateBuffered])

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

  const onSeek = useCallback(
    (seekTime: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = seekTime
        updateProgress()
      }
    },
    [updateProgress]
  )

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
