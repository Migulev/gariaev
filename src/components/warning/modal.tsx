import { Button } from '../ui/button'
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from '../ui/credenza'
import { WarningModalParams } from './types'

export const WarningModal = ({
  title,
  description,
  acknowledgeText,
  onClose,
}: WarningModalParams) => {
  return (
    <form
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClose()
      }}
    >
      <Credenza open onOpenChange={onClose}>
        <CredenzaContent className="px-2 sm:px-10 sm:py-6">
          <CredenzaHeader>
            <CredenzaTitle>{title}</CredenzaTitle>
          </CredenzaHeader>
          <CredenzaBody>{description}</CredenzaBody>
          <CredenzaFooter className="mt-3 flex-col-reverse gap-3 md:flex">
            <Button onClick={onClose}>{acknowledgeText}</Button>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </form>
  )
}
