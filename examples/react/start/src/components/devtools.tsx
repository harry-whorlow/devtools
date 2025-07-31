import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { Devtools } from '@tanstack/react-devtools'
import { StudioPlugin } from './prisma-plugin'

const queryClient = new QueryClient()

export default function DevtoolsExample() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Devtools
          plugins={[
            {
              name: 'Tanstack Query',
              render: <ReactQueryDevtoolsPanel />,
            },
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: 'Prisma Studio',
              render: <StudioPlugin />,
            },
          ]}
        />
      </QueryClientProvider>
    </>
  )
}
