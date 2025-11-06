/// <reference types="vite/client" />

export {}

declare global {
  interface Window {
    microApp: any
    mount: () => void
    unmount: () => void
    __MICRO_APP_ENVIRONMENT__: boolean
  }
}
