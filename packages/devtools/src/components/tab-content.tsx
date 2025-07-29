import { createEffect, createSignal } from 'solid-js'
import { useDevtoolsState } from '../context/use-devtools-context'
import { tabs } from '../tabs'
import type { JSX } from 'solid-js';

export const TabContent = () => {
  const { state } = useDevtoolsState()
  const [component, setComponent] = createSignal<JSX.Element | null>(
    tabs.find((t) => t.id === state().activeTab)?.component || null,
  )
  createEffect(() => {
    setComponent(
      tabs.find((t) => t.id === state().activeTab)?.component || null,
    )
  })

  return <div>{component()}</div>
}
