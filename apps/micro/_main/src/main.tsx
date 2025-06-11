import { Routes } from '@generouted/react-router'
import microApp from '@micro-zoe/micro-app'
import { createRoot } from 'react-dom/client'
import '@ant-design/v5-patch-for-react-19'
import 'virtual:windi.css'
import './index.css'

microApp.start({
  'router-mode': 'native',
})
createRoot(document.getElementById('root')!).render(<Routes />)
