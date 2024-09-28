import { indexDB } from '@/lib/IndexDb'
import { supabase } from '@/lib/supabase'
import { AudioFile, Matrix, MatrixDTO } from '@/types'
import { toast } from 'sonner'
import { create } from 'zustand'
import { createSelectorFunctions } from 'auto-zustand-selectors-hook'

type MatrixStoreState = {
  matrices: Matrix[]
  downloadedMatrices: Matrix[]
  isDownloading: boolean
  downloadProgress: number
  matrixIsDownloading: Matrix | null
  abortController: AbortController | null

  fetchMatrices: () => Promise<void>
  downloadMatrix: (matrix: Matrix) => Promise<void>
  updateDownloadedMatrices: () => void
  deleteMatrix: (matrix: Matrix) => Promise<void>
  cancelDownload: () => void
}

export const useMatrix = createSelectorFunctions(
  create<MatrixStoreState>((set, get) => ({
    matrices: [],
    isDownloading: false,
    downloadProgress: 0,
    matrixIsDownloading: null,
    downloadedMatrices: [],
    abortController: null,

    updateDownloadedMatrices: () => {
      const downloadedMatrices = get().matrices.filter(
        (matrix) => matrix.downloaded
      )
      set({ downloadedMatrices })
    },

    fetchMatrices: async () => {
      const { data: matricesDTO } = (await supabase
        .from('mp3_metadata')
        .select('*')
        .throwOnError()) as { data: MatrixDTO[] | null }

      const audioFiles = (await indexDB.getAllAudioFiles()) as AudioFile[]

      const matrices = matricesDTO?.map((matrix) => {
        const audioFile = audioFiles.find((file) => file.id === matrix.id)
        return {
          id: matrix.id,
          title: matrix.title,
          audioSource: audioFile?.audioBlob || matrix.audioUrl,
          downloaded: audioFile ? true : false,
        }
      }) as Matrix[]

      matrices.sort((a, b) => a.title.localeCompare(b.title))

      set({ matrices })
      get().updateDownloadedMatrices()
    },

    downloadMatrix: async (matrix: Matrix) => {
      if (matrix.downloaded) return

      try {
        const abortController = new AbortController()
        set({ abortController })

        const response = await fetch(matrix.audioSource as string, {
          signal: abortController.signal,
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const contentLength = +(response.headers.get('Content-Length') ?? 0)

        if (contentLength === 0) {
          throw new Error('Response body is empty')
        }

        const storageEstimate = await indexDB.getStorageEstimate()
        const freeSpace = storageEstimate.freeSpace || 0
        if (contentLength > freeSpace) {
          toast.error('Недостаточно места для скачивания файла')
          return
        }

        set({
          isDownloading: true,
          downloadProgress: 0,
          matrixIsDownloading: matrix,
        })

        const reader = response.body?.getReader()
        if (!reader) throw new Error('Response body is null')
        const chunks = []

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          if (!value) {
            console.warn('Received undefined value from reader')
            continue
          }
          chunks.push(value)
          if (get().isDownloading) {
            set({
              downloadProgress: Math.round(
                (chunks.reduce((acc, curr) => acc + curr.length, 0) /
                  contentLength) *
                  100
              ),
            })
          }
        }

        const blob = new Blob(chunks)
        await indexDB.saveAudio({
          id: matrix.id,
          audioBlob: blob,
          title: matrix.title,
        })

        const updatedMatrices = get().matrices.map((m) =>
          m.id === matrix.id
            ? { ...matrix, audioSource: blob, downloaded: true }
            : m
        )

        set({ matrices: updatedMatrices })
        get().updateDownloadedMatrices()
        toast.success(`Скачивание ${matrix.title} завершено успешно!`)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          toast.error('Скачивание аудио было прервано')
        } else {
          console.error('Error downloading audio:', error)
          toast.error('Ошибка скачивания аудио: ' + (error as Error).message)
        }
      } finally {
        if (get().isDownloading) {
          set({
            isDownloading: false,
            downloadProgress: 0,
            matrixIsDownloading: null,
            abortController: null,
          })
        }
      }
    },

    cancelDownload: () => {
      const { abortController } = get()
      if (abortController) {
        abortController.abort()
        set({
          isDownloading: false,
          downloadProgress: 0,
          matrixIsDownloading: null,
          abortController: null,
        })
      }
    },

    deleteMatrix: async (matrix: Matrix) => {
      await indexDB.deleteAudio(matrix.id)
      get().fetchMatrices()
      toast.success(`${matrix.title} матрица удалена`)
    },
  }))
)
