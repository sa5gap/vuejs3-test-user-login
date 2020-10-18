import { reactive } from 'vue'
import { delay } from './common'

export interface UserState {
  error: any
  authorized: boolean
  loading: boolean
  token: string | null
  name: string | null
}

export const user: UserState = reactive({
  error: null,
  authorized: false,
  token: null,
  name: null,
  loading: false,
})

export async function authorize(name: string, password: string) {
  try {
    user.loading = true
    const response = await fetch(
      `http://localhost:3000/authorize?login=${name}&password=${password}`
    )
    await delay(500)
    const data = await response.json()
    if (data.authorized) {
      user.authorized = true
      user.token = data.token
      user.name = name
      user.error = null
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

export async function logout() {
  console.log('user:logout')
  await delay(500)
  user.authorized = false
  user.token = user.name = user.error = null
}
