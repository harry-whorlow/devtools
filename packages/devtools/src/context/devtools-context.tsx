import { createContext } from 'solid-js'
import { createStore } from 'solid-js/store'
import { tryParseJson } from '../utils/sanitize'
import {
	TANSTACK_DEVTOOLS_SETTINGS,
	TANSTACK_DEVTOOLS_STATE,
	getStorageItem,
	setStorageItem,
} from '../utils/storage'
import { initialState } from './devtools-store'
import type { DevtoolsStore } from './devtools-store';
import type { Setter } from 'solid-js'
import type { JSX } from 'solid-js/jsx-runtime'

export interface DevtoolsPlugin {
	name: string | ((el: HTMLDivElement) => void)
	id: string
	component: (el: HTMLDivElement) => void
}

export const DevtoolsContext = createContext<{
	store: DevtoolsStore
	setStore: Setter<DevtoolsStore>
}>()

interface ContextProps {
	children: JSX.Element
	plugins?: Array<DevtoolsPlugin>
	config?: DevtoolsSettings
}

const getSettings = () => {
	const settingsString = getStorageItem(TANSTACK_DEVTOOLS_SETTINGS)
	const settings = tryParseJson<DevtoolsStore['settings']>(settingsString)
	return {
		...settings,
	}
}

const getExistingStateFromStorage = (
	config?: DevtoolsSettings,
	plugins?: Array<DevtoolsPlugin>,
) => {
	const existingState = getStorageItem(TANSTACK_DEVTOOLS_STATE)
	const settings = getSettings()

	const state: DevtoolsStore = {
		...initialState,
		plugins: plugins || [],
		state: {
			...initialState.state,
			...(existingState ? JSON.parse(existingState) : {}),
		},
		settings: {
			...initialState.settings,
			...config,
			...settings,
		},
	}
	return state
}

export type DevtoolsSettings = DevtoolsStore['settings']

export const DevtoolsProvider = (props: ContextProps) => {
	const [store, setStore] = createStore(
		getExistingStateFromStorage(props.config, props.plugins),
	)

	const value = {
		store,
		setStore: (
			updater: (prev: DevtoolsStore) => DevtoolsStore | Partial<DevtoolsStore>,
		) => {
			const newState = updater(store)
			const { settings, state: internalState } = newState
			// Store user settings for dev tools into local storage
			setStorageItem(TANSTACK_DEVTOOLS_SETTINGS, JSON.stringify(settings))
			// Store general state into local storage
			setStorageItem(TANSTACK_DEVTOOLS_STATE, JSON.stringify(internalState))
			setStore((prev) => ({
				...prev,
				...newState,
			}))
		},
	}

	return (
		<DevtoolsContext.Provider value={value}>
			{props.children}
		</DevtoolsContext.Provider>
	)
}
