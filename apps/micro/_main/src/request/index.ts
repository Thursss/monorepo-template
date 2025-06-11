import type { AxiosRequestConfig } from '@monorepo-template/request'
import RequestManager from '@monorepo-template/request'
import { message } from 'antd'

const r = new RequestManager({
  baseURL: 'http://localhost:3000',
  timeout: 30000,
})

/**
 * 高阶函数，用于包装请求函数并统一处理错误
 * @template T 泛型参数，表示返回的Promise类型
 * @param fn 需要被装饰的异步请求函数
 * @returns 返回一个包装后的函数，该函数会处理请求错误并显示对应提示信息
 * @remarks 当请求被取消时显示警告提示，其他错误显示错误提示
 */
function decorators(fn: <T>(...opt: any) => Promise<T>) {
  return <T>(config: AxiosRequestConfig, opts?: {
    callback?: (requestId: string) => void
    debounce?: boolean
  }) => {
    return fn.bind(r)<T>(config, opts).then((res: any) => {
      return res
    }).catch((err: any) => {
      if (err.code === 'ERR_CANCELED') {
        message.warning('请勿重复提交')
      }
      else {
        message.error(err.message)
      }
      throw err
    })
  }
}

export const get = decorators(r.get)
export const post = decorators(r.post)
export const request = decorators(r.request)

export default r
