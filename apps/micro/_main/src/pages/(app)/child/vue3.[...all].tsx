/** @jsxRuntime classic */
/** @jsx jsxCustomEvent */
import microApp from '@micro-zoe/micro-app'
/* eslint-disable */
import jsxCustomEvent from '@micro-zoe/micro-app/polyfill/jsx-custom-event'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function Vue3() {
  const location = useLocation()

  // 微应用加载完成标记
  const microFlag = useRef(false)
  const handleMicroAppMount = () => {
    microFlag.current = true
  }

  useEffect(() => {
    microFlag.current && microApp.router.push({
      name: 'vue3',
      path: location.pathname,
      replace: true,
    })
  }, [location.pathname])

  return (
    <micro-app
      keep-alive
      iframe
      name="vue3"
      url="http://localhost:5174"
      baseroute="/child/vue3"
      onMounted={handleMicroAppMount}
      onAftershow={handleMicroAppMount}
    />
  )
}
