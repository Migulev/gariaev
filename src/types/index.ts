export type MatrixDTO = {
  id: number
  title: string
  audioUrl: string
}

export type Matrix = Omit<MatrixDTO, 'audioUrl'> & {
  audioSource: Blob | string
  downloaded: boolean
}

export type Tab = 'all' | 'favorites' | 'downloaded'

export type AudioFile = {
  id: Matrix['id']
  audioBlob: Blob
  title: string
}
