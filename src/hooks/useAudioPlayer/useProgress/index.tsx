import { useCallback, useEffect, useRef, useState } from 'react'
import { useBuffer } from './useBuffer'

export function useProgress() {
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const progressIntervalRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const { buffered, updateBuffer } = useBuffer({ audioRef })

  const setAudioRef = useCallback((node: HTMLAudioElement | null) => {
    if (node) {
      audioRef.current = node
    }
  }, [])

  const updateProgress = useCallback(
    (isNewAudio: boolean = false) => {
      if (audioRef.current) {
        const currentTime = audioRef.current.currentTime
        const duration = audioRef.current.duration
        setCurrentTime(currentTime)
        setDuration(duration)

        if (isNewAudio) setProgress(0)
        else if (duration > 0) setProgress((currentTime / duration) * 100)
      }
    },
    [audioRef]
  )

  const startProgressUpdate = useCallback(
    (isNewAudio: boolean = false) => {
      updateProgress(isNewAudio)
      progressIntervalRef.current = window.setInterval(updateProgress, 1000)
    },
    [updateProgress]
  )

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
        audioRef.current.currentTime = seekTime
        updateProgress()
        updateBuffer()
      }
    },
    [audioRef, updateProgress, updateBuffer]
  )

  return {
    progress,
    duration,
    currentTime,
    buffered,
    startProgressUpdate,
    stopProgressUpdate,
    updateBuffer,
    onSeek,
    setDuration,
    setAudioRef,
  }
}
