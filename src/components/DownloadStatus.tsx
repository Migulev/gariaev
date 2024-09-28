import { cn } from '@/lib/utils'
import { useMatrix } from '@/store/matrix'
import { X } from 'lucide-react'
import { Button } from './ui/button'

export function DownloadStatus({ className }: { className?: string }) {
  const isDownloading = useMatrix.use.isDownloading()
  const downloadProgress = useMatrix.use.downloadProgress()
  const matrixIsDownloading = useMatrix.use.matrixIsDownloading()
  const cancelDownload = useMatrix.use.cancelDownload()

  if (!isDownloading) return null
  return (
    <div
      className={cn(
        'w-64 rounded-md border bg-background p-4 shadow-md',
        className
      )}
    >
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
