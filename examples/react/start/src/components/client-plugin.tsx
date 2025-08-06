import { queryPlugin } from '@/plugin'
import { useEffect, useState } from 'react'
queryPlugin.on('query-devtools:test', (event) => {
  console.log('Received message in here:', event)
})
export default function ClientPlugin() {
  const [events] = useState<
    Array<{ type: string; payload: { title: string; description: string } }>
  >([])

  return (
    <div>
      <h1>Client Plugin Initialized</h1>
      <p>Devtools Client is connected.</p>
      <button
        onClick={() =>
          queryPlugin.emit({
            type: 'query-devtools:test',
            payload: {
              title: 'Button Clicked',
              description:
                'This is a custom event triggered by the client plugin.',
            },
          })
        }
      >
        Click me bro
      </button>
      {events.map((event, i) => (
        <div key={i}>
          <h2>{event.payload.title}</h2>
          <p style={{ color: 'gray' }}>{event.payload.description}</p>
        </div>
      ))}
    </div>
  )
}
