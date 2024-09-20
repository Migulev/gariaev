import { useState } from 'react'

import { warningContext } from './context'
import { WarningModal } from './modal'
import { WarningModalParams, WarningParams } from './types'
import { defaultWarningParams } from './constants'

export function Warning({ children }: { children?: React.ReactNode }) {
  const [modalParams, setModalParams] = useState<WarningModalParams>()

  const getWarning = (params: WarningParams) => {
    return new Promise<boolean>((resolve) => {
      setModalParams({
        ...defaultWarningParams,
        ...params,
        onClose: () => {
          setModalParams(undefined)
          resolve(false)
        },
      })
    })
  }

  return (
    <warningContext.Provider value={{ getWarning }}>
      {children}

      {modalParams && <WarningModal {...modalParams} />}
    </warningContext.Provider>
  )
}
