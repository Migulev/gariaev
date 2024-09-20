export type WarningParams = {
  title: string
  description: string
  acknowledgeText: string
}

export type WarningModalParams = WarningParams & {
  onClose: () => void
}
