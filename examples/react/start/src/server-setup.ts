import {
  DevtoolsServer,
  DevtoolsPlugin,
  type EventMap,
} from '@tanstack/devtools/server'
import { z } from 'zod'
const devtoolsServer = new DevtoolsServer()

devtoolsServer.start()

devtoolsServer.on('click-event', (payload) => {
  console.log('Click event received:', payload)
})

devtoolsServer.onAll((e) => {
  console.log('All events:', e)
})

setInterval(() => {
  console.log('Emitting server event...')
  devtoolsServer.emit({
    type: 'server-event',
    payload: {
      title: 'Server Event',
      description: 'This is a custom event emitted by the server.',
    },
  })
}, 5000)

const eventMap = {
  'query-devtools:test': z.object({
    title: z.string(),
    description: z.string(),
  }),
  'query-devtools:init': z.object({
    title: z.string(),
    description: z.string(),
  }),
  'query-devtools:b': z.object({
    title: z.string(),
    description: z.string(),
  }),
} satisfies EventMap<'query-devtools'>

class QueryDevtoolsPlugin extends DevtoolsPlugin<typeof eventMap> {
  constructor() {
    super({
      pluginId: 'query-devtools',
    })
  }
}

const plugin = new QueryDevtoolsPlugin()
/* plugin.emit({
  type: `query-devtools:init`,
  payload: {
    // Add your payload data here
  },
}) */

plugin.onAll((e) => {
  if (e.type === 'query-devtools:test') {
    console.log('Received query-devtools:test event:', e.payload)
  }
})
plugin.on('query-devtools:test', (e) => {
  e.payload
})

export { devtoolsServer }
