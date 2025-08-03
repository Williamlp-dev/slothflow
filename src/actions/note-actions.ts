'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getCurrentUser } from '@/utils/auth-utils'
import type { ActionResult, Note } from '@/types'

const updateNoteSchema = z.object({
  id: z.string(),
  title: z.string().max(100, 'Título muito longo').optional(),
  description: z.string().max(5000, 'Descrição muito longa').optional(),
})

function revalidateDashboard() {
  revalidatePath('/dashboard', 'page')
}

export async function createNote(formData: FormData): Promise<ActionResult<Note>> {
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
        folderId,
      },
    })

    revalidateDashboard()
    return { success: true, data: note }
  } catch (error) {
    console.error('Erro ao criar nota:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar nota',
    }
  }
}

export async function updateNote(formData: FormData): Promise<ActionResult<Note>> {
  try {
    const user = await getCurrentUser()
    const { id, title, description } = updateNoteSchema.parse({
      id: formData.get('id'),
      title: formData.get('title'),
      description: formData.get('description'),
    })

    const currentNote = await prisma.note.findFirst({
      where: { id, userId: user.id },
      select: { title: true, description: true }
    })

    if (!currentNote) {
      return {
        success: false,
        error: 'Nota não encontrada ou você não tem permissão para editá-la'
      }
    }

    const titleChanged = title && title !== currentNote.title
    const descriptionChanged = description !== undefined && description !== currentNote.description

    if (!titleChanged && !descriptionChanged) {
      const fullNote = await prisma.note.findFirst({
        where: { id, userId: user.id }
      })
      return { success: true, data: fullNote! }
    }

    const updateData: any = {}
    if (titleChanged) updateData.title = title
    if (descriptionChanged) updateData.description = description

    const updatedNote = await prisma.note.update({
      where: { id, userId: user.id },
      data: updateData,
    })

    revalidateDashboard()
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

export async function deleteNote(noteId: string): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    
    const note = await prisma.note.findFirst({
      where: { id: noteId, userId: user.id }
    })

    if (!note) {
      return {
        success: false,
        error: 'Nota não encontrada ou você não tem permissão para deletá-la'
      }
    }
    
    await prisma.note.delete({
      where: { id: noteId, userId: user.id },
    })
    
    revalidateDashboard()
    return { success: true, data: null }
  } catch (error) {
    console.error('Erro ao deletar nota:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao deletar nota',
    }
  }
}

export async function getNotes(): Promise<Note[]> {
  try {
    const user = await getCurrentUser()
    return await prisma.note.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
    })
  } catch (error) {
    console.error('Erro ao buscar notas:', error)
    throw new Error(error instanceof Error ? error.message : 'Erro ao buscar notas')
  }
}
