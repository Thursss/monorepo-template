import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Layout from '../layout/index'

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        path: '/',
        Component: lazy(() => import('../pages/home/index')),
      },
      {
        path: '/child1/:router?',
        Component: lazy(() => import('../pages/child1/index')),
      },
    ],
  },
  {
    path: '/*',
    Component: lazy(() => import('../pages/404/index')),
  },
])

export default router
