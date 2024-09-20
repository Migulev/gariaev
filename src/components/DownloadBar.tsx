import { cn } from '@/lib/utils'
import { useMatrixStore } from '@/store/matrix'
import { X } from 'lucide-react'
import { Button } from './ui/button'

export function DownLoadBar({ className }: { className?: string }) {
  const {
    isDownloading,
    downloadProgress,
    matrixIsDownloading,
    cancelDownload,
  } = useMatrixStore()

  if (!isDownloading) return null
  return (
    <div className={cn('w-64 rounded-md bg-white p-4 shadow-md', className)}>
      <div className="flex items-end justify-between">
        <p className="text-sm font-bold">скачивается</p>
        <Button variant="destructive" size="icon" onClick={cancelDownload}>
          <X size={16} />
        </Button>
      </div>
      <p className="mt-2 w-44 text-sm">
        {matrixIsDownloading?.title}: {downloadProgress}%
      </p>
    </div>
  )
}
