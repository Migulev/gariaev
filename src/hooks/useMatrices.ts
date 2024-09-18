import { indexDB } from '@/lib/IndexDb'
import { supabase } from '@/lib/supabase'
import { AudioFile, Matrix, MatrixDTO } from '@/types'
import { useEffect, useState } from 'react'

export const useMatrices = () => {
  const [matrices, setMatrices] = useState<Matrix[]>([])

  useEffect(() => {
    const fetchMetadata = async () => {
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

      setMatrices(matrices)
    }

    fetchMetadata()
  }, [])

  return { matrices }
}
