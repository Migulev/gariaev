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
  id: Id
  audioBlob: Blob
  title: string
}

export type Id = number | string

export type AudioSource = string | Blob
