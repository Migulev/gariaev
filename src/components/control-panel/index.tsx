import { useAudioPlayer } from '@/store/audioPlayer'
import { useMatrix } from '@/store/matrix'
import { UIControlPanel } from './ui-control-panel'

export function ControlPanel({ className }: { className?: string }) {
  const currentAudio = useAudioPlayer.use.currentAudio()
  const isPlaying = useAudioPlayer.use.isPlaying()
  const progress = useAudioPlayer.use.progress()
  const volume = useAudioPlayer.use.volume()
  const isMuted = useAudioPlayer.use.isMuted()
  const duration = useAudioPlayer.use.duration()
  const buffered = useAudioPlayer.use.buffered()
  const currentTime = useAudioPlayer.use.currentTime()
  const togglePlay = useAudioPlayer.use.togglePlay()
  const onSeek = useAudioPlayer.use.onSeek()
  const toggleMute = useAudioPlayer.use.toggleMute()
  const onVolumeChange = useAudioPlayer.use.onVolumeChange()

  const matrices = useMatrix.use.matrices()

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
