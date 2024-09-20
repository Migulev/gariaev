import { create } from 'zustand'
import { WarningParams } from './types'

interface WarningStore {
  isOpen: boolean
  params: WarningParams | null
  resolve: ((value: boolean) => void) | null
  openWarning: (params: WarningParams) => Promise<boolean>
  closeWarning: () => void
}

export const useWarningStore = create<WarningStore>((set, get) => ({
  isOpen: false,
  params: null,
  resolve: null,
  openWarning: (params) => {
    return new Promise<boolean>((resolve) => {
      set({
        isOpen: true,
        params,
        resolve,
      })
    })
  },
  closeWarning: () => {
    const { resolve } = get()
    if (resolve) {
      resolve(false)
    }
    set({ isOpen: false, params: null, resolve: null })
  },
}))

export const useGetWarning = () => {
  const openWarning = useWarningStore((state) => state.openWarning)
  return openWarning
}
