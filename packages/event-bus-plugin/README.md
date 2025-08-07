# @tanstack/devtools

This package is still under active development and might have breaking changes in the future. Please use it with caution.

## General Usage

```tsx
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
```

## Understanding the implementation

The `TanstackDevtoolsEventSubscription` class is a base class for creating plugins that can subscribe to events in the Tanstack Devtools event bus. It allows you to define a set of events and their corresponding data schemas using a standard-schema based schemas.

It will work on both the client/server side and all you have to worry about is emitting/listening to events.
