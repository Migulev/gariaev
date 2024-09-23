import { cn } from '@/lib/utils'
import { useMatrix } from '@/store/matrix'
import { useState } from 'react'
import { TabsGroup } from './TabsGroup'
import { Input } from './ui/input'

export function MatrixPanel({ className }: { className?: string }) {
  const [search, setSearch] = useState('')
  const matrices = useMatrix.use.matrices()
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
