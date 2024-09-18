import { indexDB } from '@/lib/indexDb'
import { supabase } from '@/lib/supabase'
import { AudioFile, Matrix, MatrixDTO } from '@/types'
import { create } from 'zustand'

interface MatrixStoreState {
  matrices: Matrix[]
  downloadedMatrices: Matrix[]
  isDownloading: boolean
  downloadProgress: number
  matrixIsDownloading: Matrix | null

  fetchMatrices: () => Promise<void>
  downloadMatrix: (matrix: Matrix) => Promise<void>
  updateDownloadedMatrices: () => void
}

export const useMatrixStore = create<MatrixStoreState>((set, get) => ({
  matrices: [],
  isDownloading: false,
  downloadProgress: 0,
  matrixIsDownloading: null,
  downloadedMatrices: [],

  updateDownloadedMatrices: () => {
    const downloadedMatrices = get().matrices.filter(
      (matrix) => matrix.downloaded,
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

    set({ matrices })
    get().updateDownloadedMatrices()
  },

  downloadMatrix: async (matrix: Matrix) => {
    if (matrix.downloaded) {
      return
    }
    set({
      isDownloading: true,
      downloadProgress: 0,
      matrixIsDownloading: matrix,
    })
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
        set({
          downloadProgress: Math.round((receivedLength / contentLength) * 100),
        })
      }

      const blob = new Blob(chunks)
      await indexDB.saveAudio({
        id: matrix.id,
        audioBlob: blob,
        title: matrix.title,
      })

      const updatedMatrices = get().matrices.map((matrix) =>
        matrix.id === matrix.id
          ? { ...matrix, audioSource: blob, downloaded: true }
          : matrix,
      )

      set({ matrices: updatedMatrices })
      get().updateDownloadedMatrices()
    } catch (error) {
      console.error('Error downloading audio:', error)
      alert('Failed to download audio: ' + (error as Error).message)
    } finally {
      set({
        isDownloading: false,
        downloadProgress: 0,
        matrixIsDownloading: null,
      })
    }
  },
}))
