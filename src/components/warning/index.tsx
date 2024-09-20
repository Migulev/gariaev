import { useState } from 'react'

import { warningContext, WarningParams } from './context'
import { WarningModal } from './modal'

export function Warning({ children }: { children?: React.ReactNode }) {
  const [modalParams, setModalParams] = useState<WarningParams>()

  const getWarning = (params: WarningParams) => {
    return new Promise<boolean>((resolve) => {
      setModalParams({
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

      {modalParams && <WarningModal {...modalParams} onClose={() => {}} />}
    </warningContext.Provider>
  )
}
