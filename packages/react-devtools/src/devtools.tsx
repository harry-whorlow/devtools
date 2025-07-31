import React, { useEffect, useRef, useState } from 'react'
import {
  PLUGIN_CONTAINER_ID,
  PLUGIN_TITLE_CONTAINER_ID,
  TanStackRouterDevtoolsCore,
} from '@tanstack/devtools'
import { createPortal } from 'react-dom'
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
  Component: Render,
  setComponent: React.Dispatch<React.SetStateAction<JSX.Element | null>>,
) => {
  setComponent(typeof Component === 'function' ? Component() : Component)
}

let hydrated = false

const useHydrated = () => {
  useEffect(() => {
    if (!hydrated) {
      hydrated = true
    }
  }, [])
  return hydrated
}

export const Devtools = ({ plugins, options }: DevtoolsProps) => {
  const isHydrated = useHydrated()
  const devToolRef = useRef<HTMLDivElement>(null)
  const [PluginComponent, setPluginComponent] = useState<JSX.Element | null>(
    null,
  )
  const [TitleComponent, setTitleComponent] = useState<JSX.Element | null>(null)
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
                  () => convertRender(plugin.name as Render, setTitleComponent),
            render: () => convertRender(plugin.render, setPluginComponent),
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
  // we only render on the client side after hydration
  if (!isHydrated) return null
  const pluginContainer = document.getElementById(PLUGIN_CONTAINER_ID)
  const titleContainer = document.getElementById(PLUGIN_TITLE_CONTAINER_ID)
  return (
    <>
      <div ref={devToolRef} />
      {pluginContainer && PluginComponent
        ? createPortal(<>{PluginComponent}</>, pluginContainer)
        : null}
      {titleContainer && TitleComponent
        ? createPortal(<>{TitleComponent}</>, titleContainer)
        : null}
    </>
  )
}
