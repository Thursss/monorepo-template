import microApp from '@micro-zoe/micro-app'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function Vue3() {
  const [ps] = useSearchParams()
  const router = ps.get('router')

  useEffect(() => {
    microApp.router.push({
      name: 'child1',
      path: router || '/',
    })
  }, [router])

  return (
    // @ts-expect-error
    <micro-app name="child1" url="http://localhost:5174/" iframe="true" />
  )
}
