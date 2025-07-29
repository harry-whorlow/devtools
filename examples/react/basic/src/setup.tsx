import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import {
  Outlet,
  Link,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Devtools } from '@tanstack/react-devtools'
import { createRoot } from 'react-dom/client'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
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
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    )
  },
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: function About() {
    return <div className="p-2">Hello from About!</div>
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
            render: (el) =>
              createRoot(el).render(
                <QueryClientProvider client={queryClient}>
                  <ReactQueryDevtoolsPanel />
                </QueryClientProvider>,
              ),
          },
          {
            id: 'router',
            name: 'Tanstack Router',
            render: (el) =>
              createRoot(el).render(
                <TanStackRouterDevtoolsPanel router={router} />,
              ),
          },
        ]}
      />
    </>
  )
}
