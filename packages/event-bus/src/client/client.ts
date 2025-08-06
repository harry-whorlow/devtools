interface TanStackDevtoolsEvent<TEventName extends string, TPayload = any> {
  type: TEventName
  payload: TPayload
  pluginId?: string // Optional pluginId to filter events by plugin
}

export class TanstackDevtoolsClientEventBus {
  #port: number
  #socket: WebSocket | null
  #eventSource: EventSource | null
  #eventTarget: EventTarget
  #dispatcher = (e: Event) => {
    const event = (e as CustomEvent).detail as TanStackDevtoolsEvent<
      string,
      any
    >
    this.emitToServer(event)
    this.emitToClients(event)
  }
  constructor({ port = 42069 } = {}) {
    this.#eventSource = null
    this.#port = port
    this.#socket = null
    this.#eventTarget = this.getGlobalTarget()
  }

  private emitToClients(event: TanStackDevtoolsEvent<string>) {
    console.log('🌴 [tanstack-devtools] Emitting event from client bus', event)
    this.#eventTarget.dispatchEvent(
      new CustomEvent(event.type, { detail: event }),
    )
    this.#eventTarget.dispatchEvent(
      new CustomEvent('tanstack-devtools-global', { detail: event }),
    )
  }

  private emitToServer(event: TanStackDevtoolsEvent<string, any>) {
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
    }
  }
  start(hasServer?: boolean) {
    console.log('🌴 [tanstack-devtools] Starting client event bus')
    if (typeof window === 'undefined') {
      return
    }
    if (hasServer) {
      this.connect()
    }
    this.#eventTarget = window
    this.#eventTarget.addEventListener(
      'tanstack-dispatch-event',
      this.#dispatcher,
    )
  }
  stop() {
    if (typeof window === 'undefined') {
      return
    }
    this.#eventTarget.removeEventListener(
      'tanstack-dispatch-event',
      this.#dispatcher,
    )
    this.#eventSource?.close()
    this.#socket?.close()
    this.#socket = null
    this.#eventSource = null
  }
  private getGlobalTarget() {
    if (typeof window !== 'undefined') {
      return window
    }

    return new EventTarget()
  }
  private connectSSE() {
    this.#eventSource = new EventSource(
      `http://localhost:${this.#port}/__devtools/sse`,
    )
    this.#eventSource.onmessage = (e) => this.handleEventReceived(e.data)
  }

  private connectWebSocket() {
    this.#socket = new WebSocket(`ws://localhost:${this.#port}/__devtools/ws`)
    this.#socket.onmessage = (e) => this.handleEventReceived(e.data)
    this.#socket.onclose = () => {
      this.#socket = null
    }
    this.#socket.onerror = () => {
      // Prevent default error logging
    }
  }

  private connect() {
    try {
      this.connectWebSocket()
    } catch {
      // Do not try to connect if we're on the server side
      if (typeof window === 'undefined') return
      this.connectSSE()
    }
  }

  private handleEventReceived(data: string) {
    try {
      const event = JSON.parse(data) as TanStackDevtoolsEvent<string, any>
      this.emitToClients(event)
    } catch {}
  }
}
