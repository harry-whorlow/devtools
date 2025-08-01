import React, { useEffect, useRef, useState } from 'react'
import {
  PLUGIN_CONTAINER_ID,
  PLUGIN_TITLE_CONTAINER_ID,
  TanStackDevtoolsCore,
} from '@tanstack/devtools'
import { createPortal } from 'react-dom'
import type { JSX } from 'react'
import type {
  TanStackDevtoolsConfig,
  TanStackDevtoolsPlugin,
} from '@tanstack/devtools'

type PluginRender = JSX.Element | (() => JSX.Element)

export type TanStackDevtoolsReactPlugin = Omit<
  TanStackDevtoolsPlugin,
  'render' | 'name'
> & {
  render: PluginRender
  name: string | PluginRender
}

export interface TanStackDevtoolsReactInit {
  plugins?: Array<TanStackDevtoolsReactPlugin>
  config?: TanStackDevtoolsConfig
}

const convertRender = (
  Component: PluginRender,
  setComponent: React.Dispatch<React.SetStateAction<JSX.Element | null>>,
) => {
  setComponent(typeof Component === 'function' ? Component() : Component)
}

export const TanstackDevtools = ({
  plugins,
  config,
}: TanStackDevtoolsReactInit) => {
  const devToolRef = useRef<HTMLDivElement>(null)
  const [pluginContainer, setPluginContainer] = useState<HTMLElement | null>(
    null,
  )
  const [titleContainer, setTitleContainer] = useState<HTMLElement | null>(null)
  const [PluginComponent, setPluginComponent] = useState<JSX.Element | null>(
    null,
  )
  const [TitleComponent, setTitleComponent] = useState<JSX.Element | null>(null)
  const [devtools] = useState(
    () =>
      new TanStackDevtoolsCore({
        config,
        plugins: plugins?.map((plugin) => {
          return {
            ...plugin,
            name:
              typeof plugin.name === 'string'
                ? plugin.name
                : // The check above confirms that `plugin.name` is of Render type
                  () => {
                    setTitleContainer(
                      document.getElementById(PLUGIN_TITLE_CONTAINER_ID) ||
                        null,
                    )
                    convertRender(
                      plugin.name as PluginRender,
                      setTitleComponent,
                    )
                  },
            render: () => {
              setPluginContainer(
                document.getElementById(PLUGIN_CONTAINER_ID) || null,
              )
              convertRender(plugin.render, setPluginComponent)
            },
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
