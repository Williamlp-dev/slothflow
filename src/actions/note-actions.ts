'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

type Note = {
  id: string
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  userId: string
}

type ActionResult<T = any> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      error: string
    }

const updateNoteSchema = z.object({
  id: z.string(),
  title: z.string().max(100, 'Título muito longo').optional(),
  description: z.string().max(5000, 'Descrição muito longa').optional(),
})

async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  
  if (!session?.user?.id) {
    throw new Error('Usuário não autenticado')
  }
  
  return session.user
}

export async function createNote(
  formData: FormData
): Promise<ActionResult<Note>> {
  try {
    const user = await getCurrentUser()
    
    const title = (formData.get('title') as string) || 'Sem Título'
    const description = (formData.get('description') as string) || ''
    const folderId = formData.get('folderId') as string | null

    const note = await prisma.note.create({
      data: {
        title,
        description,
        userId: user.id,
        folderId: folderId, // Associa a nota à pasta, se um folderId for fornecido
      },
    })

    revalidatePath('/dashboard', 'page')
    
    return {
      success: true,
      data: note,
    }
  } catch (error) {
    console.error('Erro ao criar nota:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar nota',
    }
  }
}

export async function updateNote(
  formData: FormData
): Promise<ActionResult<Note>> {
  try {
    const user = await getCurrentUser()
    
    const data = {
      id: formData.get('id') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
    }

    const validatedData = updateNoteSchema.parse(data)

    const currentNote = await prisma.note.findFirst({
      where: { 
        id: validatedData.id,
        userId: user.id
      },
      select: { title: true, description: true, updatedAt: true }
    })

    if (!currentNote) {
      return {
        success: false,
        error: 'Nota não encontrada ou você não tem permissão para editá-la'
      }
    }

    const titleChanged = validatedData.title && validatedData.title !== currentNote.title
    const descriptionChanged = validatedData.description !== undefined && 
                              validatedData.description !== currentNote.description

    if (!titleChanged && !descriptionChanged) {
      const fullNote = await prisma.note.findFirst({
        where: { 
          id: validatedData.id,
          userId: user.id
        }
      })
      
      return { 
        success: true, 
        data: fullNote! 
      }
    }

    const updateData: any = {}
    if (titleChanged) updateData.title = validatedData.title
    if (descriptionChanged) updateData.description = validatedData.description

    const updatedNote = await prisma.note.update({
      where: { 
        id: validatedData.id,
        userId: user.id
      },
      data: updateData,
    })

    revalidatePath('/dashboard', 'page')
    
    return { success: true, data: updatedNote }
  } catch (error) {
    console.error('Erro ao atualizar nota:', error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar nota',
    }
  }
}

export async function batchUpdateNotes(
  updates: Array<{ id: string; title?: string; description?: string }>
): Promise<ActionResult<Note[]>> {
  try {
    const user = await getCurrentUser()
    
    const noteIds = updates.map(update => update.id)
    const userNotes = await prisma.note.findMany({
      where: {
        id: { in: noteIds },
        userId: user.id
      },
      select: { id: true }
    })
    
    if (userNotes.length !== noteIds.length) {
      return {
        success: false,
        error: 'Algumas notas não foram encontradas ou você não tem permissão para editá-las'
      }
    }

    const results = await Promise.all(
      updates.map(async (update) => {
        const { id, ...data } = update
        return prisma.note.update({
          where: { 
            id,
            userId: user.id
          },
          data
        })
      })
    )

    revalidatePath('/dashboard', 'page')
    return { success: true, data: results }
  } catch (error) {
    console.error('Erro no batch update:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar notas'
    }
  }
}

export async function updateNoteWithTimestamp(
  formData: FormData,
  lastKnownUpdate?: Date
): Promise<ActionResult<Note>> {
  try {
    const user = await getCurrentUser()
    
    const data = {
      id: formData.get('id') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
    }

    const validatedData = updateNoteSchema.parse(data)

    if (lastKnownUpdate) {
      const currentNote = await prisma.note.findFirst({
        where: { 
          id: validatedData.id,
          userId: user.id
        },
        select: { updatedAt: true }
      })

      if (!currentNote) {
        return {
          success: false,
          error: 'Nota não encontrada ou você não tem permissão para editá-la'
        }
      }

      if (currentNote.updatedAt > lastKnownUpdate) {
        return {
          success: false,
          error: 'CONFLICT: Nota foi atualizada por outro usuário'
        }
      }
    }

    const updatedNote = await prisma.note.update({
      where: { 
        id: validatedData.id,
        userId: user.id
      },
      data: {
        title: validatedData.title,
        description: validatedData.description,
      },
    })

    revalidatePath('/dashboard', 'page')
    return { success: true, data: updatedNote }
  } catch (error) {
    console.error('Erro ao atualizar nota:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar nota',
    }
  }
}

export async function deleteNote(noteId: string): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId: user.id
      }
    })

    if (!note) {
      return {
        success: false,
        error: 'Nota não encontrada ou você não tem permissão para deletá-la'
      }
    }
    
    await prisma.note.delete({
      where: { 
        id: noteId,
        userId: user.id
      },
    })
    
    revalidatePath('/dashboard', 'page')
    return { success: true, data: null }
  } catch (error) {
    console.error('Erro ao deletar nota:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao deletar nota',
    }
  }
}

export async function getNotes() {
  try {
    const user = await getCurrentUser()
    
    const notes = await prisma.note.findMany({
      where: {
        userId: user.id
      },
      orderBy: { updatedAt: 'desc' },
    })
    return notes
  } catch (error) {
    console.error('Erro ao buscar notas:', error)
    throw new Error(error instanceof Error ? error.message : 'Erro ao buscar notas')
  }
}

export async function getNotesAfter(timestamp: Date) {
  try {
    const user = await getCurrentUser()
    
    const notes = await prisma.note.findMany({
      where: {
        userId: user.id,
        updatedAt: {
          gt: timestamp
        }
      },
      orderBy: { updatedAt: 'desc' },
    })
    return notes
  } catch (error) {
    console.error('Erro ao buscar notas atualizadas:', error)
    throw new Error(error instanceof Error ? error.message : 'Erro ao buscar notas')
  }
}