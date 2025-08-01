import { lazy } from 'solid-js'
import { Portal, render } from 'solid-js/web'
import { DevtoolsProvider } from './context/devtools-context'
import { initialState } from './context/devtools-store'
import type {
  TanStackDevtoolsConfig,
  TanStackDevtoolsPlugin,
} from './context/devtools-context'

export interface TanStackDevtoolsInit {
  config?: Partial<TanStackDevtoolsConfig>
  plugins?: Array<TanStackDevtoolsPlugin>
}

export class TanStackDevtoolsCore {
  #config: TanStackDevtoolsConfig = {
    ...initialState.settings,
  }
  #plugins: Array<TanStackDevtoolsPlugin> = []
  #isMounted = false
  #dispose?: () => void
  #Component: any

  constructor(init: TanStackDevtoolsInit) {
    this.#plugins = init.plugins || []
    this.#config = {
      ...this.#config,
      ...init.config,
    }
  }

  mount<T extends HTMLElement>(el: T) {
    if (this.#isMounted) {
      throw new Error('Devtools is already mounted')
    }
    const mountTo = el
    const dispose = render(() => {
      this.#Component = lazy(() => import('./devtools'))

      const Devtools = this.#Component

      return (
        <DevtoolsProvider plugins={this.#plugins} config={this.#config}>
          <Portal mount={mountTo}>
            <Devtools />
          </Portal>
        </DevtoolsProvider>
      )
    }, mountTo)

    this.#isMounted = true
    this.#dispose = dispose
  }

  unmount() {
    if (!this.#isMounted) {
      throw new Error('Devtools is not mounted')
    }
    this.#dispose?.()
    this.#isMounted = false
  }

  setConfig(config: Partial<TanStackDevtoolsInit>) {
    this.#config = {
      ...this.#config,
      ...config,
    }
  }
}
