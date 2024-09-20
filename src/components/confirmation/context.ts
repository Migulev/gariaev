import { createStrictContext, useStrictContext } from '@/lib/utils'
import { ConfirmationParams } from './types'

export type ConfirmationContext = {
  getConfirmation: (params: ConfirmationParams) => Promise<boolean>
}

export const confirmationContext = createStrictContext<ConfirmationContext>()

export const useGetConfirmation = () => {
  const { getConfirmation } = useStrictContext(confirmationContext)

  return getConfirmation
}
