export type Id = number | string
export type AudioSource = string | Blob
export type Tab = 'all' | 'favorites' | 'downloaded'

export type MatrixDTO = {
  id: number
  title: string
  audioUrl: string
}

export type Matrix = Omit<MatrixDTO, 'audioUrl'> & {
  audioSource: Blob | string
  downloaded: boolean
}

export type AudioFile = {
  id: Id
  audioBlob: Blob
  title: string
}

export type ConfirmModalParams = {
  title: string
  description: string
  closeText: string
  confirmText: string
  onClose: () => void
  onConfirm: () => void
}
