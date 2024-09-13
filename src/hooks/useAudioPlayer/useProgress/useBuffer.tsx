import { useCallback, useEffect, useState } from 'react'

export function useBuffer({
  audioRef,
}: {
  audioRef: React.RefObject<HTMLAudioElement>
}) {
  const [buffered, setBuffered] = useState(0)

  const updateBuffer = useCallback(() => {
    if (audioRef.current) {
      try {
        const { buffered: timeRanges, duration, currentTime } = audioRef.current
        if (timeRanges.length > 0 && duration > 0) {
          let bufferedAmount = 0
          for (let i = 0; i < timeRanges.length; i++) {
            if (
              timeRanges.start(i) <= currentTime &&
              currentTime <= timeRanges.end(i)
            ) {
              bufferedAmount = timeRanges.end(i)
              break
            }
          }
          const newBuffered = (bufferedAmount / duration) * 100
          setBuffered(newBuffered)
        }
      } catch (error) {
        console.error('Error in updateBuffer:', error)
      }
    }
  }, [audioRef])

  const startBufferUpdate = useCallback(() => {
    updateBuffer()
    const intervalId = setInterval(updateBuffer, 1000)
    return () => clearInterval(intervalId)
  }, [updateBuffer])

  useEffect(() => {
    return startBufferUpdate()
  }, [startBufferUpdate])

  return {
    buffered,
    startBufferUpdate,
  }
}
