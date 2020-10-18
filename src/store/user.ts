import { reactive } from 'vue'
import * as api from '../api/user'

export interface User {
  error: any
  authorized: boolean
  loading: boolean
  token: string | null
  name: string | null
}

export const user: User = reactive({
  error: null,
  authorized: false,
  token: null,
  name: null,
  loading: false,
})

export async function authorize(name: string, password: string) {
  try {
    user.loading = true
    user.error = null
    const data = await api.login(name, password)
    if (data.authorized) {
      user.authorized = true
      user.token = data.token
      user.name = name
    } else {
      user.error = data.error || 'Authorisation error!'
      user.authorized = false
      user.name = null
    }
  } catch (e) {
    user.error = e
  } finally {
    user.loading = false
  }
}

export async function exit() {
  await api.logout()
  user.authorized = false
  user.token = user.name = user.error = null
}
