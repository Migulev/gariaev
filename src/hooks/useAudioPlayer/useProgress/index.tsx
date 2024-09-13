import { useCallback, useEffect, useRef, useState } from 'react'
import { useBuffer } from './useBuffer'

export function useProgress() {
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const progressIntervalRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const { buffered, startBufferUpdate } = useBuffer({ audioRef })

  const setAudioRef = useCallback((node: HTMLAudioElement | null) => {
    if (node) {
      audioRef.current = node
    }
  }, [])

  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime
      const duration = audioRef.current.duration
      setCurrentTime(currentTime)
      setDuration(duration)

      if (duration > 0) setProgress((currentTime / duration) * 100)
    }
  }, [audioRef])

  const startProgressUpdate = useCallback(() => {
    updateProgress()
    progressIntervalRef.current = window.setInterval(updateProgress, 1000)
  }, [updateProgress])

  const stopProgressUpdate = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => stopProgressUpdate()
  }, [stopProgressUpdate])

  const onSeek = useCallback(
    (seekTime: number) => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = seekTime
        updateProgress()
        audioRef.current.play()
      }
    },
    [audioRef, updateProgress]
  )

  return {
    progress,
    duration,
    currentTime,
    buffered,
    startBufferUpdate,
    startProgressUpdate,
    stopProgressUpdate,
    onSeek,
    setDuration,
    setAudioRef,
  }
}
