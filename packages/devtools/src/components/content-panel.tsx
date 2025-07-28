import { JSX } from 'solid-js/jsx-runtime'
import { useStyles } from '../styles/use-styles'

export const ContentPanel = (props: {
  ref: (el: HTMLDivElement | undefined) => void
  children: JSX.Element
  handleDragStart?: (e: any) => void
}) => {
  const styles = useStyles()
  return (
    <div ref={props.ref} class={styles().devtoolsPanel}>
      {props.handleDragStart ? (
        <div
          class={styles().dragHandle}
          onMouseDown={props.handleDragStart}
        ></div>
      ) : null}
      {props.children}
    </div>
  )
}
