import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import { SolidQueryDevtools } from '@tanstack/solid-query-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/solid-router-devtools'
import {
  Outlet,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/solid-router'
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools'
import { Devtools } from '@tanstack/solid-devtools'
import { Portal } from 'solid-js/web'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <div class="p-2 flex gap-2"></div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function Index() {
    return (
      <div class="p-2">
        <h3>Welcome Home!</h3>
      </div>
    )
  },
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: function About() {
    return <div class="p-2">Hello from About!</div>
  },
})

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute])

const router = createRouter({ routeTree })

const queryClient = new QueryClient()

export default function DevtoolsExample() {
  return (
    <>
      <Devtools
        plugins={[
          {
            id: 'query',
            name: 'Tanstack Query',
            render: (el) => (
              <Portal mount={el}>
                {' '}
                <QueryClientProvider client={queryClient}>
                  <SolidQueryDevtools />
                </QueryClientProvider>{' '}
              </Portal>
            ),
          },
          {
            id: 'router',
            name: 'Tanstack Router',
            render: (el) => (
              <Portal mount={el}>
                <TanStackRouterDevtoolsPanel router={router} />
              </Portal>
            ),
          },
        ]}
      />
    </>
  )
}
