import { createContext, createSignal, useContext } from 'solid-js'
import type { ParentComponent } from 'solid-js'

const useDraw = () => {
  const [activeMenuHover, setActiveMenuHover] = createSignal<boolean>(false)
  let hoverTimeout: ReturnType<typeof setTimeout> | null = null

  const hoverUtils = {
    enter: () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
        hoverTimeout = null
      }
      setActiveMenuHover(true)
    },

    leave: () => {
      hoverTimeout = setTimeout(() => {
        setActiveMenuHover(false)
      }, 400)
    },
  }

  return { activeMenuHover, hoverUtils }
}

type ContextType = ReturnType<typeof useDraw>

const DrawContext = createContext<ContextType | undefined>(undefined)

export const DrawClientProvider: ParentComponent = (props) => {
  const value = useDraw()

  return (
    <DrawContext.Provider value={value}>{props.children}</DrawContext.Provider>
  )
}

export function useDrawContext() {
  const context = useContext(DrawContext)

  if (context === undefined) {
    throw new Error(`useDrawContext must be used within a DrawClientProvider`)
  }

  return context
}
