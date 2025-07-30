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
function About() {
  return <div class="p-2">Hello from About!</div>
}
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
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
            name: 'Tanstack Query',
            render: (
              <QueryClientProvider client={queryClient}>
                <SolidQueryDevtools />
              </QueryClientProvider>
            ),
          },
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel router={router} />,
          },
        ]}
      />
    </>
  )
}
