# @tanstack/solid-devtools

This package is still under active development and might have breaking changes in the future. Please use it with caution.

## Usage

```tsx
import { TanstackDevtools } from '@tanstack/solid-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/solid-router-devtools'

function App() {
  return (
    <div>
      <h1>My App</h1>
      <TanstackDevtools
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel router={router} />,
          },
        ]}
      />
    </div>
  )
}
```


## Creating plugins

In order to create a plugin for TanStack Devtools, you can use the `plugins` prop of the `TanstackDevtools` component. Here's an example of how to create a simple plugin:

```tsx
import { TanstackDevtools } from '@tanstack/solid-devtools'

function App() {
  return (
     <div> 
        <h1>My App</h1>
        <TanstackDevtools
          plugins={[
            {
              id: "your-plugin-id",
              name: "Your Plugin",
              render: <CustomPluginComponent />,
            }
          ]}
        /> 
     </div>
  )
}
```