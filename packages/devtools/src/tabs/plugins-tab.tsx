import { For, createEffect } from 'solid-js'
import clsx from 'clsx'
import { usePlugins } from '../context/use-devtools-context'
import { useStyles } from '../styles/use-styles'

export const PluginsTab = () => {
  const { plugins, activePlugin, setActivePlugin } = usePlugins()
  let activePluginRef: HTMLDivElement | undefined
  createEffect(() => {
    const currentActivePlugin = plugins()?.find(
      (plugin) => plugin.id === activePlugin()?.id,
    )
    if (activePluginRef && currentActivePlugin) {
      currentActivePlugin.render(activePluginRef)
    }
  })
  const styles = useStyles()
  return (
    <div class={styles().pluginsTabPanel}>
      <div class={styles().pluginsTabSidebar}>
        <For each={plugins()}>
          {(plugin) => {
            let pluginHeading: HTMLHeadingElement | undefined
            createEffect(() => {
              if (pluginHeading) {
                typeof plugin.name === 'string'
                  ? (pluginHeading.textContent = plugin.name)
                  : plugin.name(pluginHeading)
              }
            })
            return (
              <div
                onClick={() => setActivePlugin(plugin)}
                class={clsx(styles().pluginName, {
                  active: activePlugin()?.id === plugin.id,
                })}
              >
                <h3 ref={pluginHeading} />
              </div>
            )
          }}
        </For>
      </div>
      <div ref={activePluginRef} class={styles().pluginsTabContent}></div>
    </div>
  )
}
