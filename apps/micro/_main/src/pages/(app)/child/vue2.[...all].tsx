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
      name: 'vue2',
      path: location.pathname,
      replace: true,
    })
  }, [location.pathname])

  return (
    <micro-app
      keep-alive
      name="vue2"
      url="https://www.micro-zoe.com/child/vue2"
      baseroute="/child/vue2"
      onMounted={handleMicroAppMount}
      onAftershow={handleMicroAppMount}
    />
  )
}
