import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    initialized: false
  }),
  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) throw error

        if (!data.user) {
          throw new Error('No se recibieron datos del usuario')
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('username, avatar_url, bio')
          .eq('id', data.user.id)
          .maybeSingle()

        this.user = {
          id: data.user.id,
          email: data.user.email,
          username: profile?.username || '',
          avatar_url: profile?.avatar_url || null,
          bio: profile?.bio || ''
        }

      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },
    async register(email, password, username) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username } }
        })
        if (error) throw error
        if (data.user) {
          this.user = {
            id: data.user.id,
            email: data.user.email,
            username,
            avatar_url: null,
            bio: null
          }
        }
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },
    
    async logout() {
      await supabase.auth.signOut()
      this.user = null
    },
    async initAuth() {
      this.loading = true
      this.initialized = true
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, avatar_url, bio')
            .eq('id', session.user.id)
            .maybeSingle()
          this.user = {
            id: session.user.id,
            email: session.user.email,
            username: profile?.username ?? '',
            avatar_url: profile?.avatar_url ?? null,
            bio: profile?.bio ?? ''
          }
        } else {
          this.user = null
        }
      } catch (err) {
        this.user = null
        console.error('Error initializing auth:', err)
      } finally {
        this.loading = false
      }
    },
    async updateProfile(updates) {
      if (!this.user) return

      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', this.user.id)
          .select()
          .single()

        if (error) throw error

        if (data) {
          this.user = {
            ...this.user,
            username: data.username ?? this.user.username,
            avatar_url: data.avatar_url ?? this.user.avatar_url,
            bio: data.bio ?? this.user.bio
          }
        }
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})