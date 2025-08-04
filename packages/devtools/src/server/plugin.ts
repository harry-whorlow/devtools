import type { StandardSchemaV1 } from '@standard-schema/spec'
interface DevtoolsEvent<TEventName extends string, TPayload = any> {
  type: TEventName
  payload: TPayload
  pluginId?: string // Optional pluginId to filter events by plugin
}

export type EventMap<TEventPrefix extends string> = Record<
  `${TEventPrefix}:${string}`,
  StandardSchemaV1.InferInput<any>
>

type AllDevtoolsEvents<TEventMap extends Record<string, any>> = {
  [K in keyof TEventMap]: DevtoolsEvent<
    K & string,
    StandardSchemaV1.InferOutput<TEventMap[K]>
  >
}[keyof TEventMap]

export class DevtoolsPlugin<
  TEventMap extends Record<string, any>,
  TPluginId extends string = TEventMap extends Record<infer P, any>
    ? P extends `${infer Id}:${string}`
      ? Id
      : never
    : never,
> {
  #port: number
  #socket: WebSocket | null
  #pluginId: TPluginId
  #eventTarget: EventTarget
  #globalListeners: Set<(msg: DevtoolsEvent<string, any>) => void>
  #eventListeners: Map<string, Set<(msg: DevtoolsEvent<string, any>) => void>> =
    new Map()

  constructor({
    port = 42069,
    pluginId,
    eventTarget,
  }: {
    port?: number
    pluginId: TPluginId
    eventTarget?: EventTarget
  }) {
    this.#port = port
    this.#socket = null
    this.#globalListeners = new Set()
    this.#pluginId = pluginId
    this.#eventTarget =
      eventTarget || (globalThis as any).__EVENT_TARGET__ || new EventTarget()
  }

  private connectWebSocket() {
    this.#socket = new WebSocket(`ws://localhost:${this.#port}/__devtools/ws`)
    this.#socket.onmessage = (e) => this.handleEventReceived(e.data)
    this.#socket.onclose = () => {
      this.#socket = null
    }
  }

  getPluginId() {
    return this.#pluginId
  }

  connect() {
    if (typeof window === 'undefined') return
    try {
      this.connectWebSocket()
    } catch {}
  }

  private emitToGlobalListeners(event: DevtoolsEvent<string, any>) {
    this.#globalListeners.forEach((l) => l(event))
  }

  private emitToEventListeners(
    eventName: string,
    payload: DevtoolsEvent<string, any>,
  ) {
    const eventListeners = this.#eventListeners.get(eventName)
    eventListeners?.forEach((l) => l(payload))
  }

  private handleEventReceived(data: string) {
    try {
      const event = JSON.parse(data) as DevtoolsEvent<string, any>
      if (this.#pluginId && event.pluginId !== this.#pluginId) {
        return
      }
      this.emitToGlobalListeners(event)
      this.emitToEventListeners(event.type, event)
    } catch {}
  }

  private emitEventToBus(event: DevtoolsEvent<string, any>) {
    const json = JSON.stringify(event)
    if (this.#socket && this.#socket.readyState === WebSocket.OPEN) {
      this.#socket.send(json)
    }
  }

  emit<K extends keyof TEventMap>(
    event: DevtoolsEvent<
      K & string,
      StandardSchemaV1.InferOutput<TEventMap[K]>
    >,
  ) {
    this.emitEventToBus(event)
  }

  on<K extends keyof TEventMap>(
    eventName: K,
    cb: (
      event: DevtoolsEvent<
        K & string,
        StandardSchemaV1.InferOutput<TEventMap[K]>
      >,
    ) => void,
  ) {
    const handler = (e: Event) => cb((e as CustomEvent).detail)
    this.#eventTarget.addEventListener(eventName as string, handler)
    this.#globalListeners.add(cb as any)
    return () => {
      this.#eventTarget.removeEventListener(eventName as string, handler)
      this.#globalListeners.delete(cb as any)
    }
  }

  onAll(cb: (event: AllDevtoolsEvents<TEventMap>) => void) {
    this.#globalListeners.add(cb)
    return () => this.#globalListeners.delete(cb)
  }
}
