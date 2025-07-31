import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { Devtools } from '@tanstack/react-devtools'
import { createRouter } from '@/router'

const queryClient = new QueryClient()

export default function DevtoolsExample() {
  return (
    <>
      <Devtools
        plugins={[
          {
            name: 'Tanstack Query',
            render: (
              <QueryClientProvider client={queryClient}>
                <ReactQueryDevtoolsPanel />
              </QueryClientProvider>
            ),
          },
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel router={createRouter()} />,
          },
        ]}
      />
    </>
  )
}
