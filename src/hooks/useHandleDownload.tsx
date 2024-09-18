import { indexDB } from '@/lib/indexDb'
import { Matrix } from '@/types'
import { useState } from 'react'

export function useHandleDownload() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const handleDownload = async (matrix: Matrix) => {
    if (matrix.downloaded) {
      return
    }
    setIsDownloading(true)
    setDownloadProgress(0)
    try {
      const response = await fetch(matrix.audioSource as string)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const reader = response.body?.getReader()
      if (!reader) throw new Error('Response body is null')
      const contentLength = +(response.headers.get('Content-Length') ?? 0)
      let receivedLength = 0
      const chunks = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
        receivedLength += value.length
        setDownloadProgress(Math.round((receivedLength / contentLength) * 100))
      }

      const blob = new Blob(chunks)
      await indexDB.saveAudio({
        id: matrix.id,
        audioBlob: blob,
        title: matrix.title,
      })
    } catch (error) {
      console.error('Error downloading audio:', error)
      alert('Failed to download audio: ' + (error as Error).message)
    } finally {
      setIsDownloading(false)
      setDownloadProgress(0)
    }
  }

  return { isDownloading, downloadProgress, handleDownload }
}
