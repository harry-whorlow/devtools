import ReactDOM from 'react-dom/client'
import Devtools from './setup'
import { queryPlugin } from './plugin'
setTimeout(() => {
  queryPlugin.emit({
    payload: {
      title: 'Test Event',
      description:
        'This is a test event from the TanStack Query Devtools plugin.',
    },
    type: 'query-devtools:test',
  })
}, 1000)

queryPlugin.on('query-devtools:test', (event) => {
  console.log('Received test event:', event)
})
function App() {
  return (
    <div>
      <h1>TanStack Devtools Basic Example</h1>
      <Devtools />
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<App />)
