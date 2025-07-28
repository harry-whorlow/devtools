import { Accessor, createMemo } from 'solid-js'
import { useDevtoolsSettings } from '../context/use-devtools-context'
import { useStyles } from '../styles/use-styles'
import clsx from 'clsx'
import { TanStackLogo } from './logo'

export const Trigger = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: Accessor<boolean>
  setIsOpen: (isOpen: boolean) => void
}) => {
  const { settings } = useDevtoolsSettings()
  const styles = useStyles()
  const buttonStyle = createMemo(() => {
    return clsx(
      styles().mainCloseBtn,
      styles().mainCloseBtnPosition(settings().position),
      styles().mainCloseBtnAnimation(isOpen()),
    )
  })
  return (
    <button
      type="button"
      aria-label="Open TanStack Devtools"
      class={buttonStyle()}
      onClick={() => setIsOpen(!isOpen())}
    >
      <TanStackLogo />
    </button>
  )
}
