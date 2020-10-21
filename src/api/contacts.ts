import { delay, url } from './common'

export interface ContactRecord {
  id: number
  name: string
  email: string | null
  phone: string | null
}

export async function load(name: string, token: string) {
  try {
    await delay(500)
    const response = await fetch(`${url}/contacts?user=${name}&token=${token}`)
    const data = await response.json()
    return data
  } catch (e) {
    throw e
  }
}

export async function update(record: ContactRecord) {
  await delay(1500)
  return true
}

export async function remove(id: number) {
  await delay(500)
  return true
}

export async function append(record: ContactRecord) {
  await delay(500)
  return true
}
