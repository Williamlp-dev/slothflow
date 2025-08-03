'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getCurrentUser } from '@/utils/auth-utils'
import type { ActionResult, Folder } from '@/types'

const folderSchema = z.object({
  name: z.string().min(1, 'O nome da pasta é obrigatório').max(50, 'Nome muito longo'),
})

const updateFolderSchema = folderSchema.extend({
  id: z.string(),
})

function revalidateDashboard() {
  revalidatePath('/dashboard', 'page')
}

export async function createFolder(formData: FormData): Promise<ActionResult<Folder>> {
  try {
    const user = await getCurrentUser()
    const { name } = folderSchema.parse({
      name: formData.get('name'),
    })

    const folder = await prisma.folder.create({
      data: { name, userId: user.id },
    })

    revalidateDashboard()
    return { success: true, data: folder }
  } catch (error) {
    console.error('Erro ao criar pasta:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar pasta',
    }
  }
}

export async function updateFolder(formData: FormData): Promise<ActionResult<Folder>> {
  try {
    const user = await getCurrentUser()
    const { id, name } = updateFolderSchema.parse({
      id: formData.get('id'),
      name: formData.get('name'),
    })

    const existingFolder = await prisma.folder.findFirst({
      where: { id, userId: user.id }
    })

    if (!existingFolder) {
      return {
        success: false,
        error: 'Pasta não encontrada ou você não tem permissão para editá-la'
      }
    }

    const duplicateFolder = await prisma.folder.findFirst({
      where: {
        name,
        userId: user.id,
        id: { not: id }
      }
    })

    if (duplicateFolder) {
      return {
        success: false,
        error: 'Já existe uma pasta com este nome'
      }
    }

    const updatedFolder = await prisma.folder.update({
      where: { id, userId: user.id },
      data: { name },
    })

    revalidateDashboard()
    return { success: true, data: updatedFolder }
  } catch (error) {
    console.error('Erro ao atualizar pasta:', error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar pasta',
    }
  }
}

export async function getFolders(): Promise<Folder[]> {
  try {
    const user = await getCurrentUser()
    return await prisma.folder.findMany({
      where: { userId: user.id },
      orderBy: { name: 'asc' },
    })
  } catch (error) {
    console.error('Erro ao buscar pastas:', error)
    throw new Error(error instanceof Error ? error.message : 'Erro ao buscar pastas')
  }
}

export async function deleteFolder(folderId: string): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()

    const folder = await prisma.folder.findFirst({
      where: { id: folderId, userId: user.id },
    })

    if (!folder) {
      return {
        success: false,
        error: 'Pasta não encontrada ou você não tem permissão para deletá-la',
      }
    }

    await prisma.folder.delete({
      where: { id: folderId },
    })

    revalidateDashboard()
    return { success: true, data: null }

  } catch (error) {
    console.error('Erro ao deletar pasta:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao deletar pasta',
    }
  }
}