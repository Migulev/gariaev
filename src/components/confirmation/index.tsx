import { useState } from 'react'

import { confirmationContext, ConfirmationParams } from './context'

import { ConfirmModalParams } from '@/types'
import { ConfirmationModal } from './modal'
import { defaultConfirmationParams } from './constants'

export function Confirmations({ children }: { children?: React.ReactNode }) {
  const [modalParams, setModalParams] = useState<ConfirmModalParams>()

  const closeConfirmation = () => {
    modalParams?.onClose()
  }

  const getConfirmation = (params: ConfirmationParams) => {
    return new Promise<boolean>((resolve) => {
      setModalParams({
        ...defaultConfirmationParams,
        ...params,
        onConfirm: () => {
          setModalParams(undefined)
          resolve(true)
        },
        onClose: () => {
          closeConfirmation()
          setModalParams(undefined)
          resolve(false)
        },
      })
    })
  }

  return (
    <confirmationContext.Provider
      value={{
        getConfirmation,
        closeConfirmation,
      }}
    >
      {children}

      {modalParams && <ConfirmationModal {...modalParams} />}
    </confirmationContext.Provider>
  )
}
