import { createEffect, createSignal } from 'solid-js'
import { createShortcut } from '@solid-primitives/keyboard'
import {
  useDevtoolsSettings,
  useHeight,
  usePersistOpen,
} from './context/use-devtools-context'
import { useDisableTabbing } from './hooks/use-disable-tabbing'
import { TANSTACK_DEVTOOLS } from './utils/storage'
import { Trigger } from './components/trigger'
import { MainPanel } from './components/main-panel'
import { ContentPanel } from './components/content-panel'
import { Tabs } from './components/tabs'
import { TabContent } from './components/tab-content'

export default function DevTools() {
  const { settings } = useDevtoolsSettings()
  const { setHeight } = useHeight()
  const { persistOpen, setPersistOpen } = usePersistOpen()
  const [rootEl, setRootEl] = createSignal<HTMLDivElement>()
  const [isOpen, setIsOpen] = createSignal(
    settings().defaultOpen || persistOpen(),
  )
  let panelRef: HTMLDivElement | undefined = undefined
  const [isResizing, setIsResizing] = createSignal(false)
  const toggleOpen = () => {
    const open = isOpen()
    setIsOpen(!open)
    setPersistOpen(!open)
  }

  // Used to resize the panel
  const handleDragStart = (
    panelElement: HTMLDivElement | undefined,
    startEvent: MouseEvent,
  ) => {
    if (startEvent.button !== 0) return // Only allow left click for drag

    setIsResizing(true)

    const dragInfo = {
      originalHeight: panelElement?.getBoundingClientRect().height ?? 0,
      pageY: startEvent.pageY,
    }

    const run = (moveEvent: MouseEvent) => {
      const delta = dragInfo.pageY - moveEvent.pageY
      const newHeight = dragInfo.originalHeight + delta

      setHeight(newHeight)

      if (newHeight < 70) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }

    const unsub = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', run)
      document.removeEventListener('mouseUp', unsub)
    }

    document.addEventListener('mousemove', run)
    document.addEventListener('mouseup', unsub)
  }

  // Handle resizing and padding adjustments
  createEffect(() => {
    if (isOpen()) {
      const previousValue = rootEl()?.parentElement?.style.paddingBottom

      const run = () => {
        const containerHeight = panelRef!.getBoundingClientRect().height
        if (rootEl()?.parentElement) {
          setRootEl((prev) => {
            if (prev?.parentElement) {
              prev.parentElement.style.paddingBottom = `${containerHeight}px`
            }
            return prev
          })
        }
      }

      run()

      if (typeof window !== 'undefined') {
        window.addEventListener('resize', run)

        return () => {
          window.removeEventListener('resize', run)
          if (rootEl()?.parentElement && typeof previousValue === 'string') {
            setRootEl((prev) => {
              prev!.parentElement!.style.paddingBottom = previousValue
              return prev
            })
          }
        }
      }
    } else {
      // Reset padding when devtools are closed
      if (rootEl()?.parentElement) {
        setRootEl((prev) => {
          if (prev?.parentElement) {
            prev.parentElement.removeAttribute('style')
          }
          return prev
        })
      }
    }
    return
  })
  createEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        toggleOpen()
      }
    })
  })
  useDisableTabbing(isOpen)
  createEffect(() => {
    if (rootEl()) {
      const el = rootEl()
      const fontSize = getComputedStyle(el!).fontSize
      el?.style.setProperty('--tsrd-font-size', fontSize)
    }
  })
  createShortcut(settings().openHotkey, () => {
    toggleOpen()
  })
  return (
    <div ref={setRootEl} data-testid={TANSTACK_DEVTOOLS}>
      <Trigger isOpen={isOpen} setIsOpen={toggleOpen} />
      <MainPanel isResizing={isResizing} isOpen={isOpen}>
        <ContentPanel
          ref={(ref) => (panelRef = ref)}
          handleDragStart={(e) => handleDragStart(panelRef, e)}
        >
          <Tabs toggleOpen={toggleOpen} />
          <TabContent />
        </ContentPanel>
      </MainPanel>
    </div>
  )
}
