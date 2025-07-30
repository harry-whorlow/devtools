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
    devtoolsPanelContainer: (
      panelLocation: DevtoolsSettings['panelLocation'],
    ) => css`
      direction: ltr;
      position: fixed;
      ${panelLocation}: 0;
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
      flex-direction: row;
      overflow: auto;
      height: 100%;
    `,
    dragHandle: (panelLocation: DevtoolsSettings['panelLocation']) => css`
      position: absolute;
      left: 0;
      ${panelLocation === 'bottom' ? 'top' : 'bottom'}: 0;
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
      &:hide-until-hover {
        opacity: 0;
        pointer-events: none;
        visibility: hidden;
      }
      &:hide-until-hover:hover {
        opacity: 1;
        pointer-events: auto;
        visibility: visible;
      }
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
    mainCloseBtnAnimation: (isOpen: boolean, hideUntilHover: boolean) => {
      if (!isOpen) {
        return hideUntilHover
          ? css`
              opacity: 0;

              &:hover {
                opacity: 1;
                pointer-events: auto;
                visibility: visible;
              }
            `
          : css`
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
    tabContainer: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      height: 100%;
      background-color: ${colors.darkGray[800]};
      border-right: 1px solid ${colors.gray[700]};
      box-shadow: 0 1px 0 ${colors.gray[700]};
      position: relative;
      width: ${size[10]};
    `,

    tab: css`
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: ${size[10]};
      cursor: pointer;
      font-size: ${fontSize.sm};
      font-family: ${fontFamily.sans};
      color: ${colors.gray[300]};
      background-color: transparent;
      border: none;
      transition: all 0.2s ease-in-out;
      border-left: 2px solid transparent;
      &:hover:not(.close):not(.active) {
        background-color: ${colors.gray[700]};
        color: ${colors.gray[100]};
        border-left: 2px solid ${colors.purple[500]};
      }
      &.active {
        background-color: ${colors.purple[500]};
        color: ${colors.gray[100]};
        border-left: 2px solid ${colors.purple[500]};
      }
      &.close {
        margin-top: auto;
        &:hover {
          background-color: ${colors.gray[700]};
        }
        &:hover {
          color: ${colors.red[500]};
        }
      }

      &.disabled {
        cursor: not-allowed;
        opacity: 0.2;
        pointer-events: none;
      }
      &.disabled:hover {
        background-color: transparent;
        color: ${colors.gray[300]};
      }
    `,
    tabContent: css`
      transition: all 0.2s ease-in-out;
      width: 100%;
      height: 100%;
    `,
    pluginsTabPanel: css`
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
      overflow: hidden;
    `,
    pluginsTabSidebar: css`
      width: ${size[48]};
      background-color: ${colors.darkGray[800]};
      border-right: 1px solid ${colors.gray[700]};
      box-shadow: 0 1px 0 ${colors.gray[700]};
      overflow-y: auto;
    `,
    pluginName: css`
      font-size: ${fontSize.xs};
      font-family: ${fontFamily.sans};
      color: ${colors.gray[300]};
      padding: ${size[2]};
      cursor: pointer;
      text-align: center;
      transition: all 0.2s ease-in-out;
      &:hover {
        background-color: ${colors.gray[700]};
        color: ${colors.gray[100]};
        padding: ${size[2]};
      }
      &.active {
        background-color: ${colors.purple[500]};
        color: ${colors.gray[100]};
      }
    `,
    pluginsTabContent: css`
      width: 100%;
      height: 100%;
      overflow-y: auto;
    `,
    selectWrapper: css`
      width: 100%;
      max-width: 250px;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    `,
    selectLabel: css`
      font-size: 0.875rem;
      font-weight: 500;
      color: #d1d5db; /* text-gray-300 */
    `,
    select: css`
      appearance: none;
      width: 100%;
      padding: 0.5rem 2.5rem 0.5rem 0.75rem;
      border-radius: 0.5rem;
      background-color: #1f2937; /* gray-800 */
      color: #f3f4f6; /* gray-100 */
      border: 1px solid #374151; /* gray-700 */
      font-size: 0.875rem;
      transition: all 0.2s ease;
      cursor: pointer;

      /* Custom arrow */
      background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      background-size: 1.25rem;

      &:hover {
        border-color: #4b5563; /* gray-600 */
      }

      &:focus {
        outline: none;
        border-color: #60a5fa; /* blue-400 */
        box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5);
      }
    `,
    inputWrapper: css`
      width: 100%;
      max-width: 250px;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    `,
    inputLabel: css`
      font-size: 0.875rem;
      font-weight: 500;
      color: #d1d5db; /* text-gray-300 */
    `,
    input: css`
      appearance: none;
      width: 100%;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      background-color: #1f2937; /* gray-800 */
      color: #f3f4f6; /* gray-100 */
      border: 1px solid #374151; /* gray-700 */
      font-size: 0.875rem;
      transition: all 0.2s ease;

      &:hover {
        border-color: #4b5563; /* gray-600 */
      }

      &:focus {
        outline: none;
        border-color: #60a5fa; /* blue-400 */
        box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5);
      }
    `,
    checkboxWrapper: css`
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      user-select: none;
    `,
    checkbox: css`
      appearance: none;
      width: 1.1rem;
      height: 1.1rem;
      border: 2px solid #374151; /* gray-700 */
      border-radius: 0.25rem;
      background-color: #1f2937; /* gray-800 */
      display: grid;
      place-items: center;
      transition: all 0.2s ease;

      &:hover {
        border-color: #4b5563; /* gray-600 */
      }

      &:checked {
        background-color: #3b82f6; /* blue-500 */
        border-color: #3b82f6; /* blue-500 */
      }

      &:checked::after {
        content: '';
        width: 0.4rem;
        height: 0.7rem;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
    `,
    checkboxLabel: css`
      color: #d1d5db; /* gray-300 */
      font-size: 0.875rem;
    `,
  }
}

export function useStyles() {
  const [_styles] = createSignal(stylesFactory())
  return _styles
}
