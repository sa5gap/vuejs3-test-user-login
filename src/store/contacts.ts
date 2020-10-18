import { reactive } from 'vue'
import { User } from './user'
import * as api from '../api/contacts'

export interface ContactRecord extends api.ContactRecord {}

export interface Contacts {
  error: string | null
  loading: boolean
  data: api.ContactRecord[]
}

export const contacts: Contacts = reactive({
  error: null,
  loading: false,
  data: [],
})

export async function load(user: User) {
  if (user.authorized && user.name && user.token) {
    try {
      contacts.loading = true
      const data = await api.load(user.name, user.token)
      contacts.data = data.data
    } catch (e) {
      contacts.error = e
    } finally {
      contacts.loading = false
    }
  }
}

export async function save() {
  try {
    api.save()
  } catch (e) {
    contacts.error = e
  }
}

export async function clear() {
  contacts.data = []
}

export async function remove(id: number) {
  const index = getIndexById(id)
  if (index !== false) {
    contacts.data.splice(index, 1)
    try {
      api.remove(id)
    } catch (e) {
      contacts.error = e
    }
  } else {
    contacts.error = 'data error'
  }
}

export async function append(record: api.ContactRecord) {
  try {
    record.id = getLastId() + 1
    api.append(record)
    contacts.data.unshift(record)
  } catch (e) {
    contacts.error = e
  }
}

// TODO: move to API in production
export const getLastId = () =>
  Math.max(...contacts.data.map((r: api.ContactRecord) => r.id))

export function getIndexById(id: number) {
  for (let i = 0; i < contacts.data.length; i++) {
    if (contacts.data[i].id === id) {
      return i
    }
  }
  return false
}
