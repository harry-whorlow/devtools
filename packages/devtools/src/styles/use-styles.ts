import * as goober from 'goober'
import { createSignal } from 'solid-js'
import { tokens } from './tokens'
import type { DevtoolsSettings } from '../context/devtools-context'
import type { Accessor } from 'solid-js'

const stylesFactory = () => {
  const { colors, font, size, alpha, border } = tokens
  const { fontFamily, size: fontSize } = font
  const css = goober.css

  return {
    devtoolsPanelContainer: css`
      direction: ltr;
      position: fixed;
      bottom: 0;
      right: 0;
      z-index: 99999;
      width: 100%;

      max-height: 90%;
      border-top: 1px solid ${colors.gray[700]};
      transform-origin: top;
    `,
    devtoolsPanelContainerVisibility: (isOpen: boolean) => {
      return css`
        visibility: ${isOpen ? 'visible' : 'hidden'};
        height: ${isOpen ? 'auto' : '0'};
      `
    },
    devtoolsPanelContainerResizing: (isResizing: Accessor<boolean>) => {
      if (isResizing()) {
        return css`
          transition: none;
        `
      }

      return css`
        transition: all 0.4s ease;
      `
    },
    devtoolsPanelContainerAnimation: (isOpen: boolean, height: number) => {
      if (isOpen) {
        return css`
          pointer-events: auto;
          transform: translateY(0);
        `
      }
      return css`
        pointer-events: none;
        transform: translateY(${height}px);
      `
    },
    logo: css`
      cursor: pointer;
      display: flex;
      flex-direction: column;
      background-color: transparent;
      border: none;
      width: ${size[12]};
      height: ${size[12]};
      font-family: ${fontFamily.sans};
      gap: ${tokens.size[0.5]};
      padding: 0px;
      &:hover {
        opacity: 0.7;
      }
    `,

    devtoolsPanel: css`
      display: flex;
      font-size: ${fontSize.sm};
      font-family: ${fontFamily.sans};
      background-color: ${colors.darkGray[700]};
      color: ${colors.gray[300]};
      width: w-screen;
      flex-direction: column;
      overflow: auto;
      height: 100%;
    `,
    dragHandle: css`
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 4px;
      cursor: row-resize;
      z-index: 100000;
      &:hover {
        background-color: ${colors.purple[400]}${alpha[90]};
      }
    `,

    mainCloseBtn: css`
      background: transparent;
      position: fixed;
      z-index: 99999;
      display: inline-flex;
      width: fit-content;
      cursor: pointer;
      appearance: none;
      border: 0;
      align-items: center;
      padding: 0;
      font-size: ${font.size.xs};
      cursor: pointer;
      transition: all 0.25s ease-out;
      &:focus-visible {
        outline-offset: 2px;
        border-radius: ${border.radius.full};
        outline: 2px solid ${colors.blue[800]};
      }
    `,
    mainCloseBtnPosition: (position: DevtoolsSettings['position']) => {
      const base = css`
        ${position === 'top-left' ? `top: ${size[2]}; left: ${size[2]};` : ''}
        ${position === 'top-right' ? `top: ${size[2]}; right: ${size[2]};` : ''}
        ${position === 'middle-left'
          ? `top: 50%; left: ${size[2]}; transform: translateY(-50%);`
          : ''}
        ${position === 'middle-right'
          ? `top: 50%; right: ${size[2]}; transform: translateY(-50%);`
          : ''}
        ${position === 'bottom-left'
          ? `bottom: ${size[2]}; left: ${size[2]};`
          : ''}
        ${position === 'bottom-right'
          ? `bottom: ${size[2]}; right: ${size[2]};`
          : ''}
      `
      return base
    },
    mainCloseBtnAnimation: (isOpen: boolean) => {
      if (!isOpen) {
        return css`
          opacity: 1;
          pointer-events: auto;
          visibility: visible;
        `
      }
      return css`
        opacity: 0;
        pointer-events: none;
        visibility: hidden;
      `
    },
  }
}

export function useStyles() {
  const [_styles] = createSignal(stylesFactory())
  return _styles
}
