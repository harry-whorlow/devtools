import React, { useEffect, useRef, useState } from 'react'
import { TanStackRouterDevtoolsCore } from '@tanstack/devtools'
import { createRoot } from 'react-dom/client'
import type { JSX } from 'react'
import type { DevtoolsOptions, DevtoolsPlugin } from '@tanstack/devtools'

type Render = JSX.Element | (() => JSX.Element)
type ReactPlugin = Omit<DevtoolsPlugin, 'render' | 'name'> & {
  render: Render
  name: string | Render
}
interface DevtoolsProps {
  plugins?: Array<ReactPlugin>
  options?: DevtoolsOptions['options']
}

const convertRender = (
  el: HTMLDivElement | HTMLHeadingElement,
  Component: Render,
) => {
  const domNode = document.createElement('div')
  const root = createRoot(domNode)
  root.render(typeof Component === 'function' ? <Component /> : Component)
  el.appendChild(domNode)
}

export const Devtools = ({ plugins, options }: DevtoolsProps) => {
  const devToolRef = useRef<HTMLDivElement>(null)
  const [devtools] = useState(
    () =>
      new TanStackRouterDevtoolsCore({
        options,
        plugins: plugins?.map((plugin) => {
          return {
            ...plugin,
            name:
              typeof plugin.name === 'string'
                ? plugin.name
                : // The check above confirms that `plugin.name` is of Render type
                  (el) => convertRender(el, plugin.name as Render),
            render: (el: HTMLDivElement) => convertRender(el, plugin.render),
          }
        }),
      }),
  )
  useEffect(() => {
    if (devToolRef.current) {
      devtools.mount(devToolRef.current)
    }

    return () => {
      devtools.unmount()
    }
  }, [devtools])

  return <div ref={devToolRef} />
}
