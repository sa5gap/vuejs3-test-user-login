import { delay, url } from './common'

interface UserResponseData {
  authorized: boolean
  token: string
  error?: string | boolean
}

export async function login(
  name: string,
  password: string
): Promise<UserResponseData> {
  try {
    await delay(500)
    const response = await fetch(
      `${url}/authorize?login=${name}&password=${password}`
    )
    const data = (await response.json()) as UserResponseData
    return data
  } catch (e) {
    throw e
  }
}

export async function logout() {
  await delay(500)
}
