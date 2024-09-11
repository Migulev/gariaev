import { useCallback, useEffect, useRef, useState } from 'react'

export function useProcess({
  audioRef,
}: {
  audioRef: React.RefObject<HTMLAudioElement>
}) {
  const [progress, setProgress] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const progressIntervalRef = useRef<number | null>(null)

  const updateProgress = useCallback(() => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime
      const duration = audioRef.current.duration
      setCurrentTime(currentTime)
      setDuration(duration)

      if (duration > 0) setProgress((currentTime / duration) * 100)
      else setProgress(0)
    }
  }, [audioRef])

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

  const updateBuffered = useCallback(
    (isNewAudio: boolean = false) => {
      if (isNewAudio) setBuffered(0)
      if (audioRef.current) {
        const bufferedRanges = audioRef.current.buffered
        const currentTime = audioRef.current.currentTime
        const duration = audioRef.current.duration
        if (bufferedRanges.length > 0 && duration > 0) {
          let bufferedEnd = 0
          for (let i = 0; i < bufferedRanges.length; i++) {
            if (
              bufferedRanges.start(i) <= currentTime &&
              currentTime <= bufferedRanges.end(i)
            ) {
              bufferedEnd = bufferedRanges.end(i)
              break
            }
          }
          setBuffered((bufferedEnd / duration) * 100)
        } else {
          setBuffered(0)
        }
      }
    },
    [audioRef]
  )

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current
      const handleProgress = () => updateBuffered()
      audio.addEventListener('progress', handleProgress)
      audio.addEventListener('timeupdate', handleProgress)

      return () => {
        audio.removeEventListener('progress', handleProgress)
        audio.removeEventListener('timeupdate', handleProgress)
      }
    }
  }, [updateBuffered])

  const onSeek = useCallback(
    (seekTime: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = seekTime
        updateProgress()
        updateBuffered()
      }
    },
    [updateProgress, updateBuffered]
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
