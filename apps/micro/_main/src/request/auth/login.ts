import { post } from '../index'

export async function _login(data: { username: string, password: string }) {
  return post<any>({
    url: '/login',
    data,
  })
}
