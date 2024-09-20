import { StateCreator } from 'zustand'
import { AudioPlayerBaseState } from '.'

export interface ProgressState {
  progress: number
  currentTime: number
  duration: number
  buffered: number
  progressIntervalRef: React.MutableRefObject<number | null>
  bufferIntervalRef: React.MutableRefObject<number | null>
  setProgress: (progress: number) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  updateProgress: () => void
  startProgressUpdate: () => void
  stopProgressUpdate: () => void
  onSeek: (seekTime: number) => void
  updateBuffer: () => void
  startBufferUpdate: () => void
  stopBufferUpdate: () => void
}

export const createProgressSlice: StateCreator<
  ProgressState & AudioPlayerBaseState,
  [],
  [],
  ProgressState
> = (set, get) => ({
  progress: 0,
  currentTime: 0,
  duration: 0,
  buffered: 0,
  progressIntervalRef: { current: null },
  bufferIntervalRef: { current: null },
  setProgress: (progress) => set({ progress }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),

  updateProgress: () => {
    const { audioRef } = get()
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime
      const duration = audioRef.current.duration
      set({ currentTime, duration })
      if (duration > 0) set({ progress: (currentTime / duration) * 100 })
    }
  },

  startProgressUpdate: () => {
    const { updateProgress, progressIntervalRef } = get()
    updateProgress()
    progressIntervalRef.current = window.setInterval(updateProgress, 1000)
  },

  stopProgressUpdate: () => {
    const { progressIntervalRef } = get()
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  },

  onSeek: (seekTime) => {
    const { audioRef, updateProgress } = get()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = seekTime
      updateProgress()
      audioRef.current
        .play()
        .catch((error) => console.error('Error playing audio:', error))
    }
  },

  updateBuffer: () => {
    const { audioRef } = get()
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
          set({ buffered: newBuffered })
        }
      } catch (error) {
        console.error('Error in updateBuffer:', error)
      }
    }
  },

  startBufferUpdate: () => {
    const { updateBuffer, bufferIntervalRef } = get()
    updateBuffer()
    bufferIntervalRef.current = window.setInterval(updateBuffer, 1000)
  },

  stopBufferUpdate: () => {
    const { bufferIntervalRef } = get()
    if (bufferIntervalRef.current) {
      clearInterval(bufferIntervalRef.current)
      bufferIntervalRef.current = null
    }
  },
})
