import { createStrictContext, useStrictContext } from '@/lib/utils'

export interface WarningParams {
  title?: string
  description?: string
  closeText?: string
  onClose?: () => void
}

export type WarningContext = {
  getWarning: (params: WarningParams) => Promise<boolean>
}

export const warningContext = createStrictContext<WarningContext>()

export const useGetConfirmation = () => {
  const { getWarning } = useStrictContext(warningContext)

  return getWarning
}
