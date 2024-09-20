import { Button } from '../ui/button'
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '../ui/credenza'
import { ConfirmationModalParams } from './types'

export const ConfirmationModal = ({
  title,
  description,
  closeText,
  confirmText,
  onClose,
  onConfirm,
}: ConfirmationModalParams) => {
  return (
    <form
      onKeyDown={(e) => {
        if (e.key === 'Enter') onConfirm()
      }}
    >
      <Credenza open onOpenChange={onClose}>
        <CredenzaContent className="px-2 sm:px-10 sm:py-6">
          <CredenzaHeader>
            <CredenzaTitle>{title}</CredenzaTitle>
          </CredenzaHeader>
          <CredenzaBody>{description}</CredenzaBody>
          <CredenzaFooter className="mt-3 flex-col-reverse gap-3 md:flex">
            <Button onClick={onClose} variant={'destructive'}>
              {closeText}
            </Button>
            <Button onClick={onConfirm}>{confirmText}</Button>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </form>
  )
}
