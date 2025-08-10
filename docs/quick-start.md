---
title: Quick Start
id: quick-start
---

TanStack Devtools is a framework-agnostic devtool for managing and debugging *devtool devtools*

To get up and running install the correct adapter for your framework:

- **React**: `npm install @tanstack/react-devtools`
- **Solid**: `npm install @tanstack/solid-devtools`

Then import the devtools into the root of your application:

```javascript
import { TanstackDevtools } from '@tanstack/react-devtools'

function App() {
  return (
    <>
      <YourApp />
      <TanstackDevtools />
    </>
  )
}
```

And you're done! If you want to add custom plugins, you can do so by using the `plugins` prop:

```javascript
import { TanstackDevtools } from '@tanstack/react-devtools'

function App() {
  return (
    <>
      <YourApp />
      <TanstackDevtools plugins={[
        // Add your custom plugins here
      ]} />
    </>
  )
}
```

For example, if you want to add TanStack query & router you could do so in the following way:
```javascript
import { TanstackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <TanstackDevtools plugins={[
        {
          name: 'Tanstack Query',
          render: <ReactQueryDevtoolsPanel />,
        },
        {
          name: 'Tanstack Router',
          render: <TanStackRouterDevtoolsPanel />,
        },
      ]} />
    </QueryClientProvider>
  )
}
```