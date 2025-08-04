import { useEffect, useState } from 'react'
import { devtoolsClient } from '@/client-setup'

export default function ClientPlugin() {
  const [events, setEvents] = useState<
    Array<{ type: string; payload: { title: string; description: string } }>
  >([])
  useEffect(() => {
    devtoolsClient.onAll((event) => {
      console.log('Received message:', event)
      setEvents((prev) => [...prev, event])
    })
    devtoolsClient.emit({
      type: 'init',
      payload: {
        title: 'Client Plugin Initialized',
        description: 'Listening for events',
      },
    })
  }, [])
  return (
    <div>
      <h1>Client Plugin Initialized</h1>
      <p>Devtools Client is connected.</p>
      <button
        onClick={() =>
          devtoolsClient.emit({
            type: 'click-event',
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
