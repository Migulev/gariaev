import { defaultWarningParams } from './constants'
import { WarningModal } from './modal'
import { useWarningStore } from './store'

export const Warning = () => {
  const { isOpen, params, closeWarning } = useWarningStore()

  const handleClose = () => closeWarning()

  return (
    <>
      {isOpen && params && (
        <WarningModal
          onClose={handleClose}
          {...defaultWarningParams}
          {...params}
        />
      )}
    </>
  )
}
