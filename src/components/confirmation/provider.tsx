import { defaultConfirmationParams } from './constants'
import { ConfirmationModal } from './modal'
import { useConfirmationStore } from './store'

export const Confirmation = () => {
  const { isOpen, params, closeConfirmation } = useConfirmationStore()

  const handleConfirm = () => closeConfirmation(true)
  const handleCancel = () => closeConfirmation(false)

  return (
    <>
      {isOpen && params && (
        <ConfirmationModal
          onClose={handleCancel}
          onConfirm={handleConfirm}
          {...defaultConfirmationParams}
          {...params}
        />
      )}
    </>
  )
}
