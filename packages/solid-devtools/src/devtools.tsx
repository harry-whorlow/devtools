import { TanStackDevtoolsCore } from '@tanstack/devtools'
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { Portal } from 'solid-js/web'
import type { JSX } from 'solid-js'
import type {
  TanStackDevtoolsConfig,
  TanStackDevtoolsPlugin,
} from '@tanstack/devtools'

type SolidPluginRender = JSX.Element | (() => JSX.Element)
const convertRender = (
  el: HTMLDivElement | HTMLHeadingElement,
  Component: SolidPluginRender,
) => (
  <Portal mount={el}>
    {typeof Component === 'function' ? <Component /> : Component}
  </Portal>
)

export type TanStackDevtoolsSolidPlugin = Omit<
  TanStackDevtoolsPlugin,
  'render' | 'name'
> & {
  render: SolidPluginRender
  name: string | SolidPluginRender
}
interface TanstackDevtoolsInit {
  plugins?: Array<TanStackDevtoolsSolidPlugin>
  config?: TanStackDevtoolsConfig
}

export const TanstackDevtools = ({ config, plugins }: TanstackDevtoolsInit) => {
  const [devtools] = createSignal(
    new TanStackDevtoolsCore({
      config,
      plugins: plugins?.map((plugin) => ({
        ...plugin,
        name:
          typeof plugin.name === 'string'
            ? plugin.name
            : // The check above confirms that `plugin.name` is of Render type
              (el) => convertRender(el, plugin.name as SolidPluginRender),
        render: (el: HTMLDivElement) => convertRender(el, plugin.render),
      })),
    }),
  )
  let devToolRef: HTMLDivElement | undefined
  createEffect(() => {
    devtools().setConfig({ config })
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
