# @tanstack/devtools-event-bus

This package is still under active development and might have breaking changes in the future. Please use it with caution.

## General Usage

### Server Event Bus

```tsx
import { TanstackDevtoolsServerEventBus } from '@tanstack/devtools-event-bus/server'
// Start the server event bus
const devtoolsServer = new TanstackDevtoolsServerEventBus()

devtoolsServer.start()

export { devtoolsServer }
```

### Client Event Bus

```ts
import { TanstackDevtoolsClientEventBus } from '@tanstack/devtools-event-bus/client'
// Start the client event bus
const devtoolsClient = new TanstackDevtoolsClientEventBus()

devtoolsClient.start()

export { devtoolsClient }
```

## Plugins

Check out @tanstack/devtools-event-bus-plugin for more information on how to create plugins for the event bus.
