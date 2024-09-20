import { createStrictContext, useStrictContext } from '@/lib/utils'
import { WarningParams } from './types'

export type WarningContext = {
  getWarning: (params: WarningParams) => Promise<boolean>
}

export const warningContext = createStrictContext<WarningContext>()

export const useGetConfirmation = () => {
  const { getWarning } = useStrictContext(warningContext)

  return getWarning
}
