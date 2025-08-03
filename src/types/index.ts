export type Note = {
  id: string
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  userId: string
  folderId?: string | null
}

export type Folder = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  userId: string
}

export type ActionResult<T = any> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      error: string
    }

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export type NoteContent = {
  title: string
  description: string
}