export type ConfirmationParams = {
  title?: string
  description?: string
  closeText?: string
  confirmText?: string
}

export type ConfirmationModalParams = ConfirmationParams & {
  onClose: () => void
  onConfirm: () => void
}
