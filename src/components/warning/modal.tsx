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
  closeText,
  onClose,
}: WarningModalParams) => {
  return (
    <Credenza open onOpenChange={onClose}>
      <CredenzaContent className="px-2 sm:px-10 sm:py-6">
        <CredenzaHeader>
          <CredenzaTitle>{title}</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>{description}</CredenzaBody>
        <CredenzaFooter className="mt-3 flex-col-reverse gap-3 md:flex">
          <Button onClick={onClose}>{closeText}</Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}
