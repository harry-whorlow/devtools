import ReactDOM from 'react-dom/client'
import { Devtools } from '@tanstack/react-devtools'
function App() {
  return (
    <div>
      <h1>TanStack Devtools Basic Example</h1>
      <Devtools options={{
        openHotkey: ["Shift", "B"]
      }} />
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<App />)
