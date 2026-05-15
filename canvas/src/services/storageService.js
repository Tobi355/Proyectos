import { supabase } from '../supabase'

export const storageService = {
  async uploadAvatar(file) {
    if (!file.type.startsWith('image/')) {
      throw new Error('Solo se permiten archivos de imagen')
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('El archivo es demasiado grande (máximo 5MB)')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}_avatar.${fileExt}`

    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })

    if (error) throw error

    // Supabase v2: publicUrl (minúscula al final)
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    return data.publicUrl
  },

  async uploadPostImage(file){
    if (!file.type.startsWith('image/')) {
      throw new Error('Solo se permiten archivos de imagen')
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('El archivo es demasiado grande (máximo 10MB)')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}_post.${fileExt}`

    const { error } = await supabase.storage
      .from('post-images')
      .upload(fileName, file, { upsert: true })

    if (error) throw error

    // Supabase v2: publicUrl (minúscula al final)
    const { data } = supabase.storage
      .from('post-images')
      .getPublicUrl(fileName)

    return data.publicUrl
  },

  async deleteFile(fileUrl, bucket) {
    try {
      const url = new URL(fileUrl)
      const parts = url.pathname.split('/')
      const fileName = parts[parts.length - 1]

      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName])

      if (error) throw error
    } catch (error) {
      console.error('Error eliminando archivo:', error)
      // No lanzamos el error ya que no es crítico
    }
  }
}
