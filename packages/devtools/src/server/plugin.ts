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
  [Key in keyof TEventMap]: DevtoolsEvent<
    Key & string,
    StandardSchemaV1.InferOutput<TEventMap[Key]>
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
  #eventSource: EventSource | null
  constructor({
    port = 42069,
    pluginId,
    eventTarget,
  }: {
    port?: number
    pluginId: TPluginId
    eventTarget?: EventTarget
  }) {
    this.#eventSource = null
    this.#port = port
    this.#socket = null
    this.#globalListeners = new Set()
    this.#pluginId = pluginId
    this.#eventTarget = this.getGlobalTarget(eventTarget)
  }

  private connectSSE() {
    this.#eventSource = new EventSource(
      `http://localhost:${this.#port}/__devtools/sse`,
    )
    this.#eventSource.onmessage = (e) => this.handleEventReceived(e.data)
  }
  private getGlobalTarget(eventTarget?: EventTarget) {
    if (typeof window !== 'undefined') {
      return window
    }
    if (typeof globalThis !== 'undefined' && globalThis.__EVENT_TARGET__) {
      return globalThis.__EVENT_TARGET__
    }
    return eventTarget || new EventTarget()
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
    try {
      this.connectWebSocket()
    } catch {
      // Do not try to connect to SSE if we're on the server side
      if (typeof window === 'undefined') return
      this.connectSSE()
    }
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
    // try to emit it to the event bus first
    if (this.#socket && this.#socket.readyState === WebSocket.OPEN) {
      this.#socket.send(json)
      // try to emit to SSE if WebSocket is not available (this will only happen on the client side)
    } else if (this.#eventSource) {
      fetch(`http://localhost:${this.#port}/__devtools/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json,
      }).catch(() => {})
      // otherwise, emit it to the event target
    } else {
      this.emitEventToEventTarget(event)
    }
  }

  private emitEventToEventTarget(event: DevtoolsEvent<string, any>) {
    this.#eventTarget.dispatchEvent(
      new CustomEvent(event.type, { detail: event }),
    )
  }

  emit<TKey extends keyof TEventMap>(
    event: DevtoolsEvent<
      TKey & string,
      StandardSchemaV1.InferOutput<TEventMap[TKey]>
    >,
  ) {
    this.emitEventToBus(event)
  }

  on<TKey extends keyof TEventMap>(
    eventName: TKey,
    cb: (
      event: DevtoolsEvent<
        TKey & string,
        StandardSchemaV1.InferOutput<TEventMap[TKey]>
      >,
    ) => void,
  ) {
    const handler = (e: Event) => cb((e as CustomEvent).detail)
    this.#eventTarget.addEventListener(eventName as string, handler)

    return () => {
      this.#eventTarget.removeEventListener(eventName as string, handler)
    }
  }

  onAll(cb: (event: AllDevtoolsEvents<TEventMap>) => void) {
    this.#globalListeners.add(cb)
    return () => this.#globalListeners.delete(cb)
  }
}
