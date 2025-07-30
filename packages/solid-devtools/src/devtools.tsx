import { TanStackRouterDevtoolsCore } from '@tanstack/devtools'
import { createEffect, createSignal, JSX, onCleanup, onMount } from 'solid-js'
import type { DevtoolsOptions, DevtoolsPlugin } from '@tanstack/devtools'
import { Portal } from 'solid-js/web'
type Render = JSX.Element | (() => JSX.Element)
const convertRender = (
  el: HTMLDivElement | HTMLHeadingElement,
  Component: Render,
) => (
  <Portal mount={el}>
    {typeof Component === 'function' ? <Component /> : Component}
  </Portal>
)

type SolidPlugin = Omit<DevtoolsPlugin, 'render' | 'name'> & {
  render: Render
  name: string | Render
}
interface DevtoolsProps {
  plugins?: Array<SolidPlugin>
  options?: DevtoolsOptions['options']
}

export const Devtools = ({ options, plugins }: DevtoolsProps) => {
  const [devtools] = createSignal(
    new TanStackRouterDevtoolsCore({
      options,
      plugins: plugins?.map((plugin) => ({
        ...plugin,
        name:
          typeof plugin.name === 'string'
            ? plugin.name
            : // The check above confirms that `plugin.name` is of Render type
              (el) => convertRender(el, plugin.name as Render),
        render: (el: HTMLDivElement) => convertRender(el, plugin.render),
      })),
    }),
  )
  let devToolRef: HTMLDivElement | undefined
  createEffect(() => {
    devtools().setOptions({ options })
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
