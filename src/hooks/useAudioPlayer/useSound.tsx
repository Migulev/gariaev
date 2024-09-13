import { useCallback, useEffect, useState } from 'react'
import { usePersist } from '../usePersist'

export function useSound({
  audioRef,
}: {
  audioRef: React.RefObject<HTMLAudioElement>
}) {
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = usePersist('audioVolume', 1, {
    converter: (value: string) => parseFloat(value),
  })

  const onVolumeChange = (newVolume: number) => setVolume(newVolume)

  const toggleMute = useCallback(() => {
    if (volume > 0) {
      setIsMuted((prev) => !prev)
      if (audioRef.current) {
        audioRef.current.muted = !isMuted
      }
    }
  }, [isMuted, audioRef, volume])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted, audioRef])

  return {
    isMuted,
    volume,
    onVolumeChange,
    toggleMute,
  }
}
