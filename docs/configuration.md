---
title: Configuration
id: configuration
---

Both TanStack `DevTools` and `EventClient` can be configured.

> **important** all configuration is optional unless marked (required)

## Devtools Configuration

With the `Devtools` there are two configuration objects, regardless of Frameworks these are the same and are provided to the Devtools through props.

- `config` configuration for the devtool panel and interaction with it
- `eventBusConfig` configuration for the event bus

The `config` object is mainly focused around user interaction with the devtools panel and accepts the following properties:

- `defaultOpen` - If the devtools are open by default

```ts
{defaultOpen: boolean}
```

- `hideUntilHover` - Hides the TanStack devtools trigger until hovered

```ts
{hideUntilHover: boolean}
```

- `position` - The position of the TanStack devtools trigger

```ts
{position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'middle-left' | 'middle-right'}
```

- `panelLocation` - The location of the devtools panel

```ts
{panelLocation: 'top' | 'bottom'}

```

- `openHotkey` - The hotkey set to open the devtools

```ts
type ModifierKey = 'Alt' | 'Control' | 'Meta' | 'Shift';
type KeyboardKey = ModifierKey | (string & {});

{openHotkey: Array<KeyboardKey>}
```

- `requireUrlFlag` - Requires a flag present in the url to enable devtools

```ts
{requireUrlFlag: boolean}

```

- `urlFlag` - The required flag that must be present in the url to enable devtools.

```ts
{urlFlag: string}
```

The `eventBusConfig` is configuration for the back bone of the devtools, the `EventBuss`, and accepts the following properties:

- `debug` - Enables debug mode for the EventBuss

```ts
{debug: boolean}
```

- `connectToServerBus` - Optional flag to indicate if the devtools server event bus is available to connect to

```ts
{connectToServerBus: boolean}
```

- `port` - The port at which the client connects to the devtools server event bus

```ts
{port: number}
```

Put together here is an example in react:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FormDevtools } from '@tanstack/react-form'

import { TanstackDevtools } from '@tanstack/react-devtools'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />

    <TanstackDevtools
      config={{ hideUntilHover: true,  }}
      eventBusConfig={{ debug: true }}
      plugins={[
        {
          name: 'Tanstack Form',
          render: <FormDevtools />,
        },
      ]}
    />
  </StrictMode>,
)

```

## EventClient Configuration

Configuration for the `EventClient` is as follows

- `pluginId` (required) - The plugin identifier used by the event bus to direct events to listeners

```ts
{pluginId: string}
```

- `debug` - Enables debug mode for the EventClient

```ts
{debug: boolean}
```

Put together the `EventClient` configuration looks like:

```tsx
import { EventClient } from '@tanstack/devtools-event-client'

type EventMap = {
  'custom-devtools:custom-state': { state: string }
}

class customEventClient extends EventClient<EventMap> {
  constructor() {
    super({
      debug: true,
      pluginId: 'custom-devtools',
    })
  }
}
```

More information about EventClient configuration can be found in our [custom-plugins example](https://tanstack.com/devtools/latest/docs/framework/react/examples/basic)
