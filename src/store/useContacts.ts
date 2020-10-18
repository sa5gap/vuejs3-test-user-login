import { reactive } from 'vue'
import { delay } from './common'
import { user } from './useUsers'

export interface ContactRecord {
  id: number
  name: string
  email: string | null
  phone: string | null
}

export interface Contacts {
  error: string | null
  loading: boolean
  data: ContactRecord[]
}

export const contacts: Contacts = reactive({
  error: null,
  loading: false,
  data: [],
})

export async function load() {
  if (user.authorized) {
    try {
      contacts.loading = true
      const response = await fetch(
        `http://localhost:3000/contacts?user=${user.name}&token=${user.token}`
      )
      await delay(500)
      const data = await response.json()
      contacts.data = data.data
    } catch (e) {
      contacts.error = e
    } finally {
      contacts.loading = false
    }
  }
}

export const getLastId = () =>
  Math.max(...contacts.data.map((o: ContactRecord) => o.id))

export async function clear() {
  contacts.data = []
}

export async function save() {
  await delay(500)
}

export async function remove(id: number) {
  await delay(500)
  const index = getIndexById(id)
  index !== false && contacts.data.splice(index, 1)
}

export async function append(record: ContactRecord) {
  await delay(500)
  record.id = getLastId() + 1
  contacts.data.unshift(record)
}

export function getIndexById(id: number) {
  for (let i = 0; i < contacts.data.length; i++) {
    if (contacts.data[i].id === id) {
      return i
    }
  }
  return false
}
