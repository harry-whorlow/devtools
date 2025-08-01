import * as goober from 'goober'
import { createSignal } from 'solid-js'
import { tokens } from './tokens'
import type { TanStackDevtoolsConfig } from '../context/devtools-context'
import type { Accessor } from 'solid-js'

const stylesFactory = () => {
  const { colors, font, size, alpha, border } = tokens
  const { fontFamily, size: fontSize } = font
  const css = goober.css

  return {
    devtoolsPanelContainer: (
      panelLocation: TanStackDevtoolsConfig['panelLocation'],
    ) => css`
      direction: ltr;
      position: fixed;
      overflow-y: hidden;
      overflow-x: hidden;
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
      overflow-x: hidden;
      overflow-y: hidden;
      height: 100%;
    `,
    dragHandle: (panelLocation: TanStackDevtoolsConfig['panelLocation']) => css`
      position: absolute;
      left: 0;
      ${panelLocation === 'bottom' ? 'top' : 'bottom'}: 0;
      width: 100%;
      height: 4px;
      cursor: row-resize;
      user-select: none;
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
    mainCloseBtnPosition: (position: TanStackDevtoolsConfig['position']) => {
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
      max-width: 300px;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    `,
    selectContainer: css`
      width: 100%;
    `,
    selectLabel: css`
      font-size: 0.875rem;
      font-weight: 500;
      color: ${colors.gray[100]};
    `,
    selectDescription: css`
      font-size: 0.8rem;
      color: ${colors.gray[400]};
      margin: 0;
      line-height: 1.3;
    `,
    select: css`
      appearance: none;
      width: 100%;
      padding: 0.75rem 3rem 0.75rem 0.75rem;
      border-radius: 0.5rem;
      background-color: ${colors.darkGray[800]};
      color: ${colors.gray[100]};
      border: 1px solid ${colors.gray[700]};
      font-size: 0.875rem;
      transition: all 0.2s ease;
      cursor: pointer;

      /* Custom arrow */
      background-image: url("data:image/svg+xml;utf8,<svg fill='%236b7280' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      background-size: 1.25rem;

      &:hover {
        border-color: ${colors.gray[600]};
      }

      &:focus {
        outline: none;
        border-color: ${colors.purple[400]};
        box-shadow: 0 0 0 3px ${colors.purple[400]}${alpha[20]};
      }
    `,
    inputWrapper: css`
      width: 100%;
      max-width: 300px;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    `,
    inputContainer: css`
      width: 100%;
    `,
    inputLabel: css`
      font-size: 0.875rem;
      font-weight: 500;
      color: ${colors.gray[100]};
    `,
    inputDescription: css`
      font-size: 0.8rem;
      color: ${colors.gray[400]};
      margin: 0;
      line-height: 1.3;
    `,
    input: css`
      appearance: none;
      width: 100%;
      padding: 0.75rem;
      border-radius: 0.5rem;
      background-color: ${colors.darkGray[800]};
      color: ${colors.gray[100]};
      border: 1px solid ${colors.gray[700]};
      font-size: 0.875rem;
      font-family: ${fontFamily.mono};
      transition: all 0.2s ease;

      &::placeholder {
        color: ${colors.gray[500]};
      }

      &:hover {
        border-color: ${colors.gray[600]};
      }

      &:focus {
        outline: none;
        border-color: ${colors.purple[400]};
        box-shadow: 0 0 0 3px ${colors.purple[400]}${alpha[20]};
      }
    `,
    checkboxWrapper: css`
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      cursor: pointer;
      user-select: none;
      padding: 0.5rem;
      border-radius: 0.5rem;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: ${colors.darkGray[800]};
      }
    `,
    checkboxContainer: css`
      width: 100%;
    `,
    checkboxLabelContainer: css`
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
    `,
    checkbox: css`
      appearance: none;
      width: 1.25rem;
      height: 1.25rem;
      border: 2px solid ${colors.gray[700]};
      border-radius: 0.375rem;
      background-color: ${colors.darkGray[800]};
      display: grid;
      place-items: center;
      transition: all 0.2s ease;
      flex-shrink: 0;
      margin-top: 0.125rem;

      &:hover {
        border-color: ${colors.purple[400]};
      }

      &:checked {
        background-color: ${colors.purple[500]};
        border-color: ${colors.purple[500]};
      }

      &:checked::after {
        content: '';
        width: 0.4rem;
        height: 0.6rem;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        margin-top: -3px;
      }
    `,
    checkboxLabel: css`
      color: ${colors.gray[100]};
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.4;
    `,
    checkboxDescription: css`
      color: ${colors.gray[400]};
      font-size: 0.8rem;
      line-height: 1.3;
    `,
    settingsContainer: css`
      padding: 1.5rem;
      height: 100%;
      overflow-y: auto;
      background-color: ${colors.darkGray[700]};
    `,
    settingsSection: css`
      margin-bottom: 2rem;
      padding: 1.5rem;
      background-color: ${colors.darkGray[800]};
      border: 1px solid ${colors.gray[700]};
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    `,
    sectionTitle: css`
      font-size: 1.125rem;
      font-weight: 600;
      color: ${colors.gray[100]};
      margin: 0 0 1rem 0;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid ${colors.gray[700]};
      display: flex;
      align-items: center;
      gap: 0.5rem;
    `,
    sectionIcon: css`
      color: ${colors.purple[400]};
    `,
    sectionDescription: css`
      color: ${colors.gray[400]};
      font-size: 0.875rem;
      margin: 0 0 1.5rem 0;
      line-height: 1.5;
    `,
    settingsGroup: css`
      display: flex;
      flex-direction: column;
      gap: 1rem;
    `,
    conditionalSetting: css`
      margin-left: 1.5rem;
      padding-left: 1rem;
      border-left: 2px solid ${colors.purple[400]};
      background-color: ${colors.darkGray[800]};
      padding: 1rem;
      border-radius: 0.5rem;
      margin-top: 0.5rem;
    `,
    settingRow: css`
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    `,
  }
}

export function useStyles() {
  const [_styles] = createSignal(stylesFactory())
  return _styles
}
