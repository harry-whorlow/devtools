import type { StandardSchemaV1 } from '@standard-schema/spec'

interface TanStackDevtoolsEvent<TEventName extends string, TPayload = any> {
  type: TEventName
  payload: TPayload
  pluginId?: string // Optional pluginId to filter events by plugin
}
declare global {
  // eslint-disable-next-line no-var
  var __TANSTACK_EVENT_TARGET__: EventTarget | null
}

export type EventMap<TEventPrefix extends string> = Record<
  `${TEventPrefix}:${string}`,
  StandardSchemaV1.InferInput<any>
>

type AllDevtoolsEvents<TEventMap extends Record<string, any>> = {
  [Key in keyof TEventMap]: TanStackDevtoolsEvent<
    Key & string,
    StandardSchemaV1.InferOutput<TEventMap[Key]>
  >
}[keyof TEventMap]

export class TanstackDevtoolsEventSubscription<
  TEventMap extends Record<string, any>,
  TPluginId extends string = TEventMap extends Record<infer P, any>
    ? P extends `${infer Id}:${string}`
      ? Id
      : never
    : never,
> {
  #pluginId: TPluginId
  #eventTarget: () => EventTarget
  #debug: boolean
  constructor({
    pluginId,
    debug = false,
  }: {
    pluginId: TPluginId
    debug?: boolean
  }) {
    this.#pluginId = pluginId
    this.#eventTarget = this.getGlobalTarget
    this.#debug = debug
    this.debugLog(' Initializing event subscription for plugin', this.#pluginId)
  }

  private debugLog(...args: Array<any>) {
    if (this.#debug) {
      console.log(`🌴 [tanstack-devtools:${this.#pluginId}-plugin]`, ...args)
    }
  }
  private getGlobalTarget() {
    // CLient event target is the window object
    if (typeof window !== 'undefined') {
      this.debugLog('Using window as event target')
      return window
    }
    // server one is the global event target
    if (
      typeof globalThis !== 'undefined' &&
      globalThis.__TANSTACK_EVENT_TARGET__
    ) {
      this.debugLog('Using global event target')
      return globalThis.__TANSTACK_EVENT_TARGET__
    }

    this.debugLog('Using new EventTarget as fallback')
    return new EventTarget()
  }

  getPluginId() {
    return this.#pluginId
  }

  private emitEventToBus(event: TanStackDevtoolsEvent<string, any>) {
    this.debugLog('Emitting event to client bus', event)
    this.#eventTarget().dispatchEvent(
      new CustomEvent('tanstack-dispatch-event', { detail: event }),
    )
  }

  emit<TKey extends keyof TEventMap>(
    event: TanStackDevtoolsEvent<
      TKey & string,
      StandardSchemaV1.InferOutput<TEventMap[TKey]>
    >,
  ) {
    this.emitEventToBus(event)
  }

  on<TKey extends keyof TEventMap>(
    eventName: TKey,
    cb: (
      event: TanStackDevtoolsEvent<
        TKey & string,
        StandardSchemaV1.InferOutput<TEventMap[TKey]>
      >,
    ) => void,
  ) {
    const handler = (e: Event) => {
      this.debugLog('Received event from bus', (e as CustomEvent).detail)
      cb((e as CustomEvent).detail)
    }
    this.#eventTarget().addEventListener(eventName as string, handler)
    this.debugLog('Registered event to bus', eventName)
    return () => {
      this.#eventTarget().removeEventListener(eventName as string, handler)
    }
  }

  onAll(cb: (event: TanStackDevtoolsEvent<string, any>) => void) {
    const handler = (e: Event) => {
      const event = (e as CustomEvent).detail

      cb(event)
    }
    this.#eventTarget().addEventListener('tanstack-devtools-global', handler)
    return () =>
      this.#eventTarget().removeEventListener(
        'tanstack-devtools-global',
        handler,
      )
  }
  onAllPluginEvents(cb: (event: AllDevtoolsEvents<TEventMap>) => void) {
    const handler = (e: Event) => {
      const event = (e as CustomEvent).detail
      if (this.#pluginId && event.pluginId !== this.#pluginId) {
        return
      }
      cb(event)
    }
    this.#eventTarget().addEventListener('tanstack-devtools-global', handler)
    return () =>
      this.#eventTarget().removeEventListener(
        'tanstack-devtools-global',
        handler,
      )
  }
}
