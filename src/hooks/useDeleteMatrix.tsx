import { useGetConfirmation } from '@/components/confirmation'
import { useMatrix } from '@/store/matrix'
import { Matrix } from '@/types'

export const useDeleteMatrix = () => {
  const deleteMatrixStore = useMatrix.use.deleteMatrix()
  const getConfirmation = useGetConfirmation()

  const deleteMatrix = async (matrix: Matrix) => {
    const confirmation = await getConfirmation({
      title: 'Удаление матрицы',
      description: `Вы уверены, что хотите удалить матрицу "${matrix.title}"?`,
      confirmText: 'Удалить',
      closeText: 'Отменить',
    })
    if (confirmation) {
      await deleteMatrixStore(matrix)
    }
  }

  return {
    deleteMatrix,
  }
}
