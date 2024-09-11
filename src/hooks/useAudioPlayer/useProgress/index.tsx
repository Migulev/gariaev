import { useCallback, useEffect, useRef, useState } from 'react'
import { useBuffer } from './useBuffer'

export function useProgress({
  audioRef,
}: {
  audioRef: React.RefObject<HTMLAudioElement>
}) {
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const progressIntervalRef = useRef<number | null>(null)

  const { buffered, updateBuffered } = useBuffer({ audioRef })

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

  const startProgressInterval = useCallback(() => {
    updateProgress(true)
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

  const onSeek = useCallback(
    (seekTime: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = seekTime
        updateProgress()
        updateBuffered()
      }
    },
    [audioRef, updateProgress, updateBuffered]
  )

  return {
    progress,
    duration,
    currentTime,
    buffered,
    startProgressInterval,
    stopProgressInterval,
    updateBuffered,
    onSeek,
    setDuration,
  }
}
