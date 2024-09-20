import { useAudioPlayerStore } from '@/store/audioPlayer'
import { UIControlPanel } from './ui-control-panel'
import { useMatrixStore } from '@/store/matrix.store'

export function ControlPanel({ className }: { className?: string }) {
  const {
    currentAudio,
    isPlaying,
    progress,
    volume,
    isMuted,
    duration,
    buffered,
    currentTime,
    togglePlay,
    onSeek,
    toggleMute,
    onVolumeChange,
  } = useAudioPlayerStore()

  const matrices = useMatrixStore((state) => state.matrices)

  return (
    <UIControlPanel
      className={className}
      audioTitle={matrices.find((m) => m.id === currentAudio)?.title}
      isPlaying={isPlaying}
      progress={progress}
      volume={volume}
      isMuted={isMuted}
      duration={duration}
      buffered={buffered}
      currentTime={currentTime}
      toggleMute={toggleMute}
      onVolumeChange={onVolumeChange}
      onSeek={onSeek}
      onTogglePlay={() =>
        currentAudio &&
        togglePlay(
          currentAudio,
          matrices.find((m) => m.id === currentAudio)?.audioSource || ''
        )
      }
    />
  )
}
