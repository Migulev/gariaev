export type WarningParams = {
  title?: string
  description?: string
  closeText?: string
}

export type WarningModalParams = WarningParams & {
  onClose: () => void
}
