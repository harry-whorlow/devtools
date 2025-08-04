interface DevtoolsEvent<TEventName extends string, TPayload = any> {
  type: TEventName
  payload: TPayload
}

export class DevtoolsClient {
  #port: number
  #socket: WebSocket | null
  #eventSource: EventSource | null
  #globalListeners: Set<(msg: DevtoolsEvent<string>) => void>
  #eventListeners: Map<string, Set<(msg: DevtoolsEvent<string>) => void>> =
    new Map()
  #eventTarget: EventTarget

  constructor({ port = 42069, eventTarget = new EventTarget() } = {}) {
    this.#port = port
    this.#socket = null
    this.#eventSource = null
    this.#globalListeners = new Set()
    this.#eventTarget = eventTarget
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
      this.connectSSE()
    }
  }

  /**
   * Connect to the DevTools server using WebSocket or EventSource.
   * This method will try to establish a WebSocket connection first, and if it fails,
   * it will fall back to using EventSource for Server-Sent Events (SSE).
   * @returns void
   */
  connect() {
    if (typeof window === 'undefined') return

    try {
      this.connectWebSocket()
    } catch {
      this.connectSSE()
    }
  }

  /**
   * Emit an event to all global listeners, useful for broadcasting/listening to all events.
   * @param event The event payload to emit
   */
  private emitToGlobalListeners(event: DevtoolsEvent<string>) {
    this.#globalListeners.forEach((l) => l(event))
  }

  /**
   * Emit an event to specific listeners of that event (not global listeners).
   * This is useful to subscribing to specific events (eg. 'plugin:connect').
   * @param eventName The name of the event to emit to specific listeners
   * @param event The event payload
   * @returns void
   */
  private emitToEventListeners(
    eventName: string,
    payload: DevtoolsEvent<string>,
  ) {
    const eventListeners = this.#eventListeners.get(eventName)
    eventListeners?.forEach((l) => l(payload))
  }

  /**
   * Handle an event received from the server by parsing the JSON string then emitting it to both
   * global listeners and specific event listeners.
   * This method is called when a message is received from the WebSocket or EventSource.
   * @param data The data received from the server, expected to be a JSON string representing a DevtoolsEvent.
   */
  private handleEventReceived(data: string) {
    try {
      const event = JSON.parse(data) as DevtoolsEvent<string>
      this.emitToGlobalListeners(event)
      this.emitToEventListeners(event.type, event)
    } catch {}
  }

  /**
   * Emit an event to the server so it can sent it to other client/server listeners.
   * @param event The event to emit to the server so it can sent it to other client/server listeners
   */
  private emitEventToServer(event: DevtoolsEvent<string>) {
    const json = JSON.stringify(event)
    if (this.#socket && this.#socket.readyState === WebSocket.OPEN) {
      this.#socket.send(json)
    } else if (this.#eventSource) {
      fetch(`http://localhost:${this.#port}/__devtools/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json,
      }).catch(() => {})
    }
  }
  /**
   * Emit an event to the server/client listeners. This will send the event to the server
   * via WebSocket or EventSource, and also dispatch it to the event target for local listeners
   * on the client.
   * @param event The event object to send to the server/client listeners.
   */
  emit(event: DevtoolsEvent<string>) {
    this.emitEventToServer(event)

    this.#eventTarget.dispatchEvent(
      new CustomEvent(event.type, { detail: event }),
    )
  }
  /**
   * Listen for a specific event. This will add a listener for the specified event type
   * and invoke the callback when the event is received.
   * @param eventName The name of the event to listen for.
   * @param cb The callback to invoke when the event is received.
   * @returns A function to unsubscribe from the event.
   * @example
   * ```ts
   * client.on('plugin:connect', (event) => {
   *   console.log('Plugin connected:', event)
   * })
   * ```
   */
  on(eventName: string, cb: (event: DevtoolsEvent<string>) => void) {
    const handler = (e: Event) => cb((e as CustomEvent).detail)
    this.#eventTarget.addEventListener(eventName, handler)
    this.#globalListeners.add(cb)
    return () => {
      this.#eventTarget.removeEventListener(eventName, handler)
      this.#globalListeners.delete(cb)
    }
  }
  /**
   * This is useful for debugging or monitoring all events without needing to specify each event type.
   * It will invoke the callback for every event received by the client, regardless of its type.
   * @param cb A callback to be invoked for all events received by the client.
   * @returns A function to unsubscribe from all events.
   */
  onAll(cb: (event: DevtoolsEvent<string>) => void) {
    this.#globalListeners.add(cb)
    return () => this.#globalListeners.delete(cb)
  }
}
