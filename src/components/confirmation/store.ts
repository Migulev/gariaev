import { create } from 'zustand'
import { ConfirmationParams } from './types'

interface ConfirmationStore {
  isOpen: boolean
  params: ConfirmationParams | null
  resolve: ((value: boolean) => void) | null
  openConfirmation: (params: ConfirmationParams) => Promise<boolean>
  closeConfirmation: (confirmed: boolean) => void
}

export const useConfirmationStore = create<ConfirmationStore>((set, get) => ({
  isOpen: false,
  params: null,
  resolve: null,
  openConfirmation: (params) => {
    return new Promise<boolean>((resolve) => {
      set({
        isOpen: true,
        params: { ...params },
        resolve,
      })
    })
  },
  closeConfirmation: (confirmed) => {
    const { resolve } = get()
    if (resolve) {
      resolve(confirmed)
    }
    set({ isOpen: false, params: null, resolve: null })
  },
}))

export const useGetConfirmation = () => {
  const openConfirmation = useConfirmationStore(
    (state) => state.openConfirmation
  )
  return openConfirmation
}
