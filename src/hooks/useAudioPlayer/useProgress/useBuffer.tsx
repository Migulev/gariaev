import { useCallback, useEffect, useState } from 'react'

export function useBuffer({
  audioRef,
}: {
  audioRef: React.RefObject<HTMLAudioElement>
}) {
  const [buffered, setBuffered] = useState(0)

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
  }, [audioRef, updateBuffered])

  return {
    buffered,
    updateBuffered,
  }
}
