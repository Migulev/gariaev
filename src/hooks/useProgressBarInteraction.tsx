import { useCallback, useEffect, useRef, useState } from 'react'

export const useProgressBarInteraction = ({
  duration,
  onSeek,
}: {
  duration: number
  onSeek: (time: number) => void
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleProgressBarInteraction = useCallback(
    (clientX: number) => {
      if (progressBarRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect()
        const clickPosition = clientX - rect.left
        const percentClicked = Math.max(
          0,
          Math.min(1, clickPosition / rect.width),
        )
        const newTime = percentClicked * duration
        onSeek(newTime)
      }
    },
    [duration, onSeek],
  )

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    handleProgressBarInteraction(event.clientX)
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true)
    handleProgressBarInteraction(event.touches[0].clientX)
  }

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        handleProgressBarInteraction(event.clientX)
      }
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (isDragging) {
        event.preventDefault() // Prevent default touch behavior
        handleProgressBarInteraction(event.touches[0].clientX)
      }
    }

    const handleEnd = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleEnd)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, handleProgressBarInteraction])

  return { progressBarRef, handleMouseDown, handleTouchStart }
}
