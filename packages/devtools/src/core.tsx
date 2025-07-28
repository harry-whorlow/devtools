import { lazy } from 'solid-js'
import { Portal, render } from 'solid-js/web'
import {
  DevtoolsSettings,
  DevtoolsPlugin,
  DevtoolsProvider,
} from './context/devtools-context'
import { initialState } from './context/devtools-store'

export interface DevtoolsOptions {
  options?: Partial<DevtoolsSettings>
  plugins?: DevtoolsPlugin[]
}

class TanStackDevtoolsCore {
  #options: DevtoolsSettings = {
    ...initialState.settings
  }
  #plugins: DevtoolsPlugin[] = []
  #isMounted = false
  #dispose?: () => void
  #Component: any

  constructor(config: DevtoolsOptions) {
    this.#plugins = config.plugins || []
    this.#options = {
      ...this.#options,
      ...config.options,
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
        <DevtoolsProvider plugins={this.#plugins} config={this.#options}>
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

  setOptions(options: Partial<DevtoolsOptions>) {
    this.#options = {
      ...this.#options,
      ...options,
    }
  }
}

export { TanStackDevtoolsCore as TanStackRouterDevtoolsCore }
