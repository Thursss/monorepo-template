import './App.css'

function App() {
  return (
    // @ts-expect-error
    <micro-app name="vue3" url="http://localhost:5174/" iframe="true" />
  )
}

export default App
