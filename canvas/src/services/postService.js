import { supabase } from '../supabase'

// Helper para obtener el ID del usuario actual de forma segura (v2)
async function getCurrentUserId(){
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user?.id ?? null
}

export const postService = {
  async getPosts() {
    const userId = await getCurrentUserId()

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:user_id (id, username, avatar_url),
        likes:likes (id, user_id),
        comments:comments (id)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(post => ({
      ...post,
      likes_count: post.likes?.length ?? 0,
      comments_count: post.comments?.length ?? 0,
      liked: userId ? (post.likes?.some((like) => like.user_id === userId) ?? false) : false
    }))
  },

  async getPostsByUserId(userId) {
    const currentUserId = await getCurrentUserId()

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:user_id (id, username, avatar_url),
        likes:likes (id, user_id),
        comments:comments (id)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(post => ({
      ...post,
      likes_count: post.likes?.length ?? 0,
      comments_count: post.comments?.length ?? 0,
      liked: currentUserId ? (post.likes?.some((like) => like.user_id === currentUserId) ?? false) : false
    }))
  },

  async createPost(content, imageUrl = null) {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error('Usuario no autenticado')

    const { data, error } = await supabase
      .from('posts')
      .insert({
        content,
        image_url: imageUrl,
        user_id: userId
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async toggleLike(postId) {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error('Usuario no autenticado')

    const { data: existingLike, error: likeError } = await supabase
      .from('likes')
      .select('id')
      .match({ post_id: postId, user_id: userId })
      .maybeSingle()

    if (likeError) throw likeError

    if (existingLike) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .match({ id: existingLike.id })
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('likes')
        .insert({ post_id: postId, user_id: userId })
      if (error) throw error
    }
  },

  async getComments(postId) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:user_id (id, username, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  },

  async createComment(postId, content) {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error('Usuario no autenticado')

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        content,
        user_id: userId
      })
      .select(`
        *,
        user:user_id (id, username, avatar_url)
      `)
      .single()

    if (error) throw error
    return data
  },

  async updateComment(commentId, content) {
    const { data, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', commentId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteComment(commentId) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (error) throw error
  }
}
