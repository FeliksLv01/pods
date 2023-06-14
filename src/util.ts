import { access } from 'fs/promises'

export const precheck = async (name: string): Promise<boolean> => {
  try {
    await access(name)
    return false
  } catch {
    return true
  }
}
