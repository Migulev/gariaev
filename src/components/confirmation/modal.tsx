import { ConfirmModalParams } from '@/types'
import { Button } from '../ui/button'
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '../ui/credenza'

export const ConfirmationModal = ({
  title,
  description,
  closeText,
  confirmText,
  onClose,
  onConfirm,
}: ConfirmModalParams) => {
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
