import { useState } from 'react'

import { confirmationContext } from './context'

import { ConfirmationModal } from './modal'
import { defaultConfirmationParams } from './constants'
import { ConfirmationParams, ConfirmationModalParams } from './types'

export function Confirmation({ children }: { children?: React.ReactNode }) {
  const [modalParams, setModalParams] = useState<ConfirmationModalParams>()

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
      }}
    >
      {children}

      {modalParams && <ConfirmationModal {...modalParams} />}
    </confirmationContext.Provider>
  )
}
