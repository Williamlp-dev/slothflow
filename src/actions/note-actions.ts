'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

type Note = {
  id: string
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
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

export async function createNote(
  formData: FormData
): Promise<ActionResult<Note>> {
  try {
    const data = {
      title: (formData.get('title') as string) || 'Sem Título',
      description: (formData.get('description') as string) || '',
    }

    const note = await prisma.note.create({
      data: {
        title: data.title,
        description: data.description,
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
      error: 'Erro ao criar nota',
    }
  }
}

export async function updateNote(
  formData: FormData
): Promise<ActionResult<Note>> {
  try {
    const data = {
      id: formData.get('id') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
    }

    const validatedData = updateNoteSchema.parse(data)

    const currentNote = await prisma.note.findUnique({
      where: { id: validatedData.id },
      select: { title: true, description: true, updatedAt: true }
    })

    if (!currentNote) {
      return {
        success: false,
        error: 'Nota não encontrada'
      }
    }

    const titleChanged = validatedData.title && validatedData.title !== currentNote.title
    const descriptionChanged = validatedData.description !== undefined && 
                              validatedData.description !== currentNote.description

    if (!titleChanged && !descriptionChanged) {
      const fullNote = await prisma.note.findUnique({
        where: { id: validatedData.id }
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
      where: { id: validatedData.id },
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
      error: 'Erro ao atualizar nota',
    }
  }
}

export async function batchUpdateNotes(
  updates: Array<{ id: string; title?: string; description?: string }>
): Promise<ActionResult<Note[]>> {
  try {
    const results = await Promise.all(
      updates.map(async (update) => {
        const { id, ...data } = update
        return prisma.note.update({
          where: { id },
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
      error: 'Erro ao atualizar notas'
    }
  }
}

export async function updateNoteWithTimestamp(
  formData: FormData,
  lastKnownUpdate?: Date
): Promise<ActionResult<Note>> {
  try {
    const data = {
      id: formData.get('id') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
    }

    const validatedData = updateNoteSchema.parse(data)

    if (lastKnownUpdate) {
      const currentNote = await prisma.note.findUnique({
        where: { id: validatedData.id },
        select: { updatedAt: true }
      })

      if (currentNote && currentNote.updatedAt > lastKnownUpdate) {
        return {
          success: false,
          error: 'CONFLICT: Nota foi atualizada por outro usuário'
        }
      }
    }

    const updatedNote = await prisma.note.update({
      where: { id: validatedData.id },
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
      error: 'Erro ao atualizar nota',
    }
  }
}

export async function deleteNote(noteId: string): Promise<ActionResult> {
  try {
    await prisma.note.delete({
      where: { id: noteId },
    })
    
    revalidatePath('/dashboard', 'page')
    return { success: true, data: null }
  } catch (error) {
    console.error('Erro ao deletar nota:', error)
    return {
      success: false,
      error: 'Erro ao deletar nota',
    }
  }
}

export async function getNotes() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { updatedAt: 'desc' },
    })
    return notes
  } catch (error) {
    console.error('Erro ao buscar notas:', error)
    throw new Error('Erro ao buscar notas')
  }
}

export async function getNotesAfter(timestamp: Date) {
  try {
    const notes = await prisma.note.findMany({
      where: {
        updatedAt: {
          gt: timestamp
        }
      },
      orderBy: { updatedAt: 'desc' },
    })
    return notes
  } catch (error) {
    console.error('Erro ao buscar notas atualizadas:', error)
    throw new Error('Erro ao buscar notas')
  }
}