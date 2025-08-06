import { z } from 'zod'
import { TanstackDevtoolsEventSubscription } from '@tanstack/devtools-event-bus-plugin'

const eventMap = {
  'query-devtools:test': z.object({
    title: z.string(),
    description: z.string(),
  }),
  'query-devtools:init': z.object({
    title: z.string(),
    description: z.string(),
  }),
  'query-devtools:query': z.object({
    title: z.string(),
    description: z.string(),
  }),
}

class QueryDevtoolsPlugin extends TanstackDevtoolsEventSubscription<
  typeof eventMap
> {
  constructor() {
    super({
      pluginId: 'query-devtools',
    })
  }
}

export const queryPlugin = new QueryDevtoolsPlugin()
