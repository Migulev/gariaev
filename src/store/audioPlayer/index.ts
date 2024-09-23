import { createSelectorFunctions } from 'auto-zustand-selectors-hook'
import { useAudioPlayerStore } from './audioPlayer'

const useAudioPlayer = createSelectorFunctions(useAudioPlayerStore)

export { useAudioPlayer }
