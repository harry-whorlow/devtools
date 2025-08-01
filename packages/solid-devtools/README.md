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
