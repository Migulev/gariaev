import { AudioSource, Id } from '@/types'
import { create } from 'zustand'
import { createProgressSlice, type ProgressState } from './progress'
import { createVolumeSlice, type VolumeState } from './volume'

export interface AudioPlayerBaseState {
  audioRef: React.RefObject<HTMLAudioElement>
  currentAudio: Id | null
  isPlaying: boolean
  setAudioRef: (node: HTMLAudioElement | null) => void
  onSeek: (seekTime: number) => void
  togglePlay: (id: Id, audioSource: AudioSource) => void
  handlePlaySameAudio: () => void
  handlePlayNewAudio: (id: Id, audioSource: AudioSource) => void
  cleanup: () => void
}

type AudioPlayerState = AudioPlayerBaseState & VolumeState & ProgressState

export const useAudioPlayerStore = create<AudioPlayerState>(
  (set, get, api) => ({
    audioRef: { current: null },
    currentAudio: null,
    isPlaying: false,

    setAudioRef: (node: HTMLAudioElement | null) =>
      set(() => {
        if (node) {
          return { audioRef: { current: node } }
        }
        return {}
      }),

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

    togglePlay: (id: Id, audioSource: AudioSource) => {
      const { currentAudio, handlePlaySameAudio, handlePlayNewAudio } = get()
      try {
        if (currentAudio === id) {
          handlePlaySameAudio()
        } else {
          handlePlayNewAudio(id, audioSource)
        }
      } catch (error) {
        console.error('Error toggling play:', error)
        set({ isPlaying: false })
      }
    },

    handlePlaySameAudio: () => {
      const { audioRef, startProgressUpdate, stopProgressUpdate } = get()
      if (audioRef.current?.paused) {
        audioRef.current?.play().then(() => {
          audioRef.current!.volume = get().volume
          startProgressUpdate()
          set({ isPlaying: true })
        })
      } else {
        audioRef.current?.pause()
        stopProgressUpdate()
        set({ isPlaying: false })
      }
    },

    handlePlayNewAudio: (id: Id, audioSource: AudioSource) => {
      const {
        audioRef,
        startProgressUpdate,
        startBufferUpdate,
        setDuration,
        cleanup,
      } = get()

      cleanup()

      let audioUrl: string
      if (audioSource instanceof Blob) {
        audioUrl = URL.createObjectURL(audioSource)
      } else {
        audioUrl = audioSource
      }

      const audio = audioRef.current || new Audio()
      audio.src = audioUrl
      set({ audioRef: { current: audio }, currentAudio: id, isPlaying: false })

      audio.load()

      audio.addEventListener(
        'canplay',
        () => {
          audio
            .play()
            .then(() => {
              audio.volume = get().volume
              set({ isPlaying: true })
              startProgressUpdate()
              startBufferUpdate()
            })
            .catch((error: Error) =>
              console.error('Error playing audio:', error)
            )
        },
        { once: true }
      )

      audio.addEventListener(
        'loadedmetadata',
        () => {
          setDuration(audio.duration)
        },
        { once: true }
      )
    },

    cleanup: () => {
      const { audioRef, stopProgressUpdate, stopBufferUpdate } = get()
      stopProgressUpdate()
      stopBufferUpdate()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current.load()
        if (audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src)
        }
      }
    },

    ...createVolumeSlice(set, get, api),
    ...createProgressSlice(set, get, api),
  })
)
