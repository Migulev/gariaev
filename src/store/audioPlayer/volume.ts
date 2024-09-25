import { StateCreator } from 'zustand'
import { AudioPlayerBaseState } from './audioPlayer'

export interface VolumeState {
  isMuted: boolean
  volume: number
  setIsMuted: (isMuted: boolean) => void
  setVolume: (volume: number) => void
  onVolumeChange: (newVolume: number) => void
  toggleMute: () => void
}

const VOLUME_KEY = 'audioPlayerVolume'

export const createVolumeSlice: StateCreator<
  VolumeState & AudioPlayerBaseState,
  [],
  [],
  VolumeState
> = (set, get) => ({
  isMuted: false,
  volume: parseFloat(localStorage.getItem(VOLUME_KEY) || '1'),

  setIsMuted: (isMuted: boolean) => set({ isMuted }),

  setVolume: (newVolume: number) => {
    set({ volume: newVolume })
    localStorage.setItem(VOLUME_KEY, newVolume.toString())
    const { audioRef, isMuted } = get()
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume
    }
  },

  onVolumeChange: (newVolume: number) => {
    set({ volume: newVolume })
    localStorage.setItem(VOLUME_KEY, newVolume.toString())
    const { audioRef, isMuted } = get()
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume
    }
  },

  toggleMute: () => {
    const { volume, isMuted, audioRef } = get()
    if (volume > 0) {
      const newMuted = !isMuted
      set({ isMuted: newMuted })
      if (audioRef.current) {
        audioRef.current.muted = newMuted
        audioRef.current.volume = newMuted ? 0 : volume
      }
    }
  },
})
