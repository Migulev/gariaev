import { cn } from '@/lib/utils'
import { useState } from 'react'
import { TabsGroup } from './TabsGroup'
import { Input } from './ui/input'
import { useMatrixStore } from '@/store/matrix.store'

export function MatrixPanel({ className }: { className?: string }) {
  const [search, setSearch] = useState('')
  const matrices = useMatrixStore((state) => state.matrices)
  const filteredMatrices = matrices.filter((matrix) =>
    matrix.title.toLowerCase().startsWith(search.toLowerCase())
  )

  return (
    <div className={cn(className)}>
      <Input
        type="text"
        placeholder="поиск матрицы..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <TabsGroup className="mt-4" matrices={filteredMatrices} />
    </div>
  )
}
