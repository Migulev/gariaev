import { ConfirmationModalParams } from './types'

export const defaultConfirmationParams: ConfirmationModalParams = {
  title: 'Подтвердите действие',
  description: 'Вы уверены что хотите продолжить?',
  closeText: 'Отмена',
  confirmText: 'Подтвердить',
  onClose: () => {},
  onConfirm: () => {},
}
