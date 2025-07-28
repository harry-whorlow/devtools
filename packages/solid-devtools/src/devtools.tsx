import { TanStackRouterDevtoolsCore } from '@tanstack/devtools'
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import type { DevtoolsOptions } from '@tanstack/devtools'

export const Devtools = (opts: DevtoolsOptions) => {
  const [devtools] = createSignal(new TanStackRouterDevtoolsCore(opts))
  let devToolRef: HTMLDivElement | undefined
  createEffect(() => {
    devtools().setOptions(opts)
  })
  onMount(() => {
    if (devToolRef) {
      devtools().mount(devToolRef)

      onCleanup(() => {
        devtools().unmount()
      })
    }
  })
  return <div ref={devToolRef} />
}
