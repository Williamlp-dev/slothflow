'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

type Folder = {
  id: string
  name: string
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

const folderSchema = z.object({
  name: z.string().min(1, 'O nome da pasta é obrigatório').max(50, 'Nome muito longo'),
})

const updateFolderSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'O nome da pasta é obrigatório').max(50, 'Nome muito longo'),
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

export async function createFolder(
  formData: FormData
): Promise<ActionResult<Folder>> {
  try {
    const user = await getCurrentUser()
    const validatedData = folderSchema.parse({
      name: formData.get('name'),
    })

    const folder = await prisma.folder.create({
      data: {
        name: validatedData.name,
        userId: user.id,
      },
    })

    revalidatePath('/dashboard', 'page')
    return { success: true, data: folder }
  } catch (error) {
    console.error('Erro ao criar pasta:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar pasta',
    }
  }
}

export async function updateFolder(
  formData: FormData
): Promise<ActionResult<Folder>> {
  try {
    const user = await getCurrentUser()
    
    const data = {
      id: formData.get('id') as string,
      name: formData.get('name') as string,
    }

    const validatedData = updateFolderSchema.parse(data)

    // Verificar se a pasta existe e pertence ao usuário
    const existingFolder = await prisma.folder.findFirst({
      where: { 
        id: validatedData.id,
        userId: user.id
      }
    })

    if (!existingFolder) {
      return {
        success: false,
        error: 'Pasta não encontrada ou você não tem permissão para editá-la'
      }
    }

    // Verificar se não existe outra pasta com o mesmo nome
    const duplicateFolder = await prisma.folder.findFirst({
      where: {
        name: validatedData.name,
        userId: user.id,
        id: { not: validatedData.id } // Excluir a pasta atual da verificação
      }
    })

    if (duplicateFolder) {
      return {
        success: false,
        error: 'Já existe uma pasta com este nome'
      }
    }

    const updatedFolder = await prisma.folder.update({
      where: { 
        id: validatedData.id,
        userId: user.id
      },
      data: {
        name: validatedData.name,
      },
    })

    revalidatePath('/dashboard', 'page')
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
    const folders = await prisma.folder.findMany({
      where: { userId: user.id },
      orderBy: { name: 'asc' },
    })
    return folders
  } catch (error) {
    console.error('Erro ao buscar pastas:', error)
    throw new Error(error instanceof Error ? error.message : 'Erro ao buscar pastas')
  }
}

export async function deleteFolder(folderId: string): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();

    const folder = await prisma.folder.findFirst({
      where: { id: folderId, userId: user.id },
    });

    if (!folder) {
      return {
        success: false,
        error: 'Pasta não encontrada ou você não tem permissão para deletá-la',
      };
    }

    await prisma.folder.delete({
      where: { id: folderId },
    });

    revalidatePath('/dashboard', 'page');
    return { success: true, data: null };

  } catch (error) {
    console.error('Erro ao deletar pasta:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao deletar pasta',
    };
  }
}