import { useGetConfirmation } from '@/components/confirmation'
import { useMatrixStore } from '@/store/matrix'
import { Matrix } from '@/types'

export const useDeleteMatrix = () => {
  const deleteMatrixStore = useMatrixStore((state) => state.deleteMatrix)
  const getConfirmation = useGetConfirmation()

  const deleteMatrix = async (matrix: Matrix) => {
    const confirmation = await getConfirmation({
      title: 'Удаление матрицы',
      description: `Вы уверены, что хотите удалить матрицу "${matrix.title}"?`,
      confirmText: 'Удалить',
      closeText: 'Отменить',
    })
    if (confirmation) {
      deleteMatrixStore(matrix)
    }
  }

  return {
    deleteMatrix,
  }
}
