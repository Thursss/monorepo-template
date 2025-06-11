import type { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from 'axios'
import axios from 'axios'

class RequestManager {
  instance: AxiosInstance // Axios 实例

  pendingRequests: Map<string, any> // 进行中的请求
  completedRequests: Map<string, any> // 已完成的请求
  cancelledRequests: Map<string, any> // 已取消的请求

  globalDebounce: boolean // 全局防抖开关
  requestCounter: number // 请求计数器

  constructor(config?: CreateAxiosDefaults) {
    // 初始化 Axios 实例
    this.instance = axios.create(config)

    // 存储所有请求
    this.pendingRequests = new Map() // 进行中的请求
    this.completedRequests = new Map() // 已完成的请求
    this.cancelledRequests = new Map() // 已取消的请求

    // 配置选项
    this.globalDebounce = true // 全局防抖开关
    this.requestCounter = 0 // 请求计数器

    // 初始化拦截器
    this.setupInterceptors()
  }

  /**
   * 生成请求唯一标识
   * @param {object} config Axios 请求配置
   * @returns {string} 唯一标识
   */
  static generateRequestKey(config: AxiosRequestConfig) {
    const { method, url, params, data } = config
    return `${method}-${url}-${JSON.stringify(params)}-${JSON.stringify(data)}`
  }

  /**
   * 添加请求到待处理队列
   * @param {object} config Axios 请求配置
   * @returns {string} 生成的请求ID
   */
  addPendingRequest(config: AxiosRequestConfig, debounce = true) {
    const requestId = `REQ-${++this.requestCounter}`
    // 如果防抖开启，检查是否有重复请求
    if (debounce ?? this.globalDebounce) {
      const requestKey = RequestManager.generateRequestKey(config)

      // 取消已存在的相同请求
      for (const [id, request] of this.pendingRequests) {
        if (RequestManager.generateRequestKey(request.config) === requestKey) {
          this.cancelRequest(id, `取消重复请求: ${id}`)
        }
      }
    }

    // 创建新的 AbortController
    const controller = new AbortController()

    // 存储请求信息
    this.pendingRequests.set(requestId, {
      id: requestId,
      config,
      controller,
      status: 'pending',
      startTime: Date.now(),
      endTime: null,
    })

    return requestId
  }

  /**
   * 完成请求（从pending移动到completed）
   * @param {string} requestId 请求ID
   */
  completeRequest(requestId: string) {
    if (this.pendingRequests.has(requestId)) {
      const request = this.pendingRequests.get(requestId)
      request.status = 'completed'
      request.endTime = Date.now()

      this.pendingRequests.delete(requestId)
      this.completedRequests.set(requestId, request)
    }
  }

  /**
   * 取消请求
   * @param {string} requestId 请求ID
   * @param {string} [reason] 取消原因
   * @returns {boolean} 是否取消成功
   */
  cancelRequest(requestId: string, reason = '手动取消请求') {
    if (this.pendingRequests.has(requestId)) {
      const request = this.pendingRequests.get(requestId)
      request.controller.abort(reason)
      request.status = 'cancelled'
      request.endTime = Date.now()
      request.cancelReason = reason

      this.pendingRequests.delete(requestId)
      this.cancelledRequests.set(requestId, request)
      return true
    }
    return false
  }

  /**
   * 取消所有进行中的请求
   * @param {string} [reason] 取消原因
   */
  cancelAllRequests(reason = '取消所有请求') {
    this.pendingRequests.forEach((request, requestId) => {
      this.cancelRequest(requestId, reason)
    })
  }

  /**
   * 设置请求防抖开关
   * @param {boolean} enabled 是否启用
   */
  setDebounceEnabled(enabled: boolean) {
    this.globalDebounce = enabled
  }

  /**
   * 发起请求并管理请求队列
   * @template T 响应数据类型
   * @param config Axios请求配置
   * @param opts 可选参数
   * @param opts.callback 请求开始时的回调函数，接收请求ID，可用于手动取消请求
   * @param opts.debounce 是否启用防抖，默认为true
   * @returns 返回Promise包装的响应数据
   * @throws 当请求失败时抛出错误
   */
  request<T>(config: AxiosRequestConfig, opts?: { callback?: (requestId: string) => void, debounce?: boolean }) {
    const { callback, debounce = true } = opts || {}
    // 添加请求到队列并获取ID
    const requestId = this.addPendingRequest(config, debounce)

    // 执行回调返回requestId
    if (typeof callback === 'function') {
      callback?.(requestId)
    }

    // 设置中断信号
    config.signal = this.pendingRequests.get(requestId).controller.signal

    // 发起请求
    return this.instance(config)
      .then((response) => {
        this.completeRequest(requestId)
        return response
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          // 请求被取消，不改变状态（已在cancelRequest中处理）
        }
        else {
          this.completeRequest(requestId)
        }
        throw error
      }) as Promise<T>
  }

  get<T>(config: Omit<AxiosRequestConfig, 'method'>, opts?: { callback?: (requestId: string) => void, debounce?: boolean }) {
    return this.request<T>({ method: 'get', ...config }, opts)
  }

  post<T>(config: Omit<AxiosRequestConfig, 'method'>, opts?: { callback?: (requestId: string) => void, debounce?: boolean }) {
    return this.request<T>({ method: 'post', ...config }, opts)
  }

  /**
   * 初始化axios拦截器
   */
  setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 可以在这里统一处理config
        return config
      },
      error => Promise.reject(error),
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => {
        return response.data
      },
      (error) => {
        if (axios.isCancel(error)) {
          // 请求被取消
        }

        return Promise.reject(error)
      },
    )
  }

  /**
   * 获取请求状态
   * @param {string} requestId 请求ID
   * @returns {object | null} 请求状态信息
   */
  getRequestStatus(requestId: string) {
    if (this.pendingRequests.has(requestId)) {
      return this.pendingRequests.get(requestId)
    }
    if (this.completedRequests.has(requestId)) {
      return this.completedRequests.get(requestId)
    }
    if (this.cancelledRequests.has(requestId)) {
      return this.cancelledRequests.get(requestId)
    }
    return null
  }

  /**
   * 获取所有请求统计
   * @returns {object} 统计信息
   */
  getStats() {
    return {
      total: this.requestCounter,
      pending: this.pendingRequests.size,
      completed: this.completedRequests.size,
      cancelled: this.cancelledRequests.size,
    }
  }
}

export type { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults }
export default RequestManager
