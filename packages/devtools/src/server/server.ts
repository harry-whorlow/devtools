import http from 'node:http'
import { WebSocket, WebSocketServer } from 'ws'

// Shared types

interface DevtoolsEvent<TEventName extends string, TPayload = any> {
  type: TEventName
  payload: TPayload
  pluginId?: string // Optional pluginId to filter events by plugin
}
// Used so no new server starts up when HMR happens
declare global {
  // eslint-disable-next-line no-var
  var __DEVTOOLS_SERVER__: http.Server | null
  // eslint-disable-next-line no-var
  var __DEVTOOLS_WSS_SERVER__: WebSocketServer | null
  // eslint-disable-next-line no-var
  var __EVENT_TARGET__: EventTarget | null
}

export class DevtoolsServer {
  #eventTarget: EventTarget
  #clients = new Set<WebSocket>()
  #sseClients = new Set<http.ServerResponse>()
  #server: http.Server | null = null
  #wssServer: WebSocketServer | null = null
  #port: number
  #globalListeners = new Set<(msg: DevtoolsEvent<string>) => void>()
  constructor({ port = 42069, eventTarget = new EventTarget() } = {}) {
    this.#port = port
    this.#eventTarget = globalThis.__EVENT_TARGET__ ?? eventTarget
    if (!globalThis.__EVENT_TARGET__) {
      globalThis.__EVENT_TARGET__ = eventTarget
    }
    this.#server = globalThis.__DEVTOOLS_SERVER__ ?? null
    this.#wssServer = globalThis.__DEVTOOLS_WSS_SERVER__ ?? null
  }

  private emitToServer(event: DevtoolsEvent<string>) {
    this.#globalListeners.forEach((l) => l(event))
    this.#eventTarget.dispatchEvent(
      new CustomEvent(event.type, { detail: event }),
    )
  }

  onAll(listener: (msg: DevtoolsEvent<string>) => void) {
    this.#globalListeners.add(listener)
    return () => this.#globalListeners.delete(listener)
  }
  on<T>(event: string, listener: (payload: DevtoolsEvent<string, T>) => void) {
    const handler = (e: Event) => listener((e as CustomEvent).detail)
    this.#eventTarget.addEventListener(event, handler)
    return () => this.#eventTarget.removeEventListener(event, handler)
  }

  private emitEventToClients(event: DevtoolsEvent<string>) {
    const json = JSON.stringify(event)

    for (const client of this.#clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(json)
      }
    }
    for (const res of this.#sseClients) {
      res.write(`data: ${json}\n\n`)
    }
  }
  emit(event: DevtoolsEvent<string>) {
    this.emitEventToClients(event)
    this.emitToServer(event)
  }

  stop() {
    this.#server?.close(() => {
      console.log('🌴 [tanstack-devtools] Server stopped')
    })
    this.#wssServer?.close(() => {
      console.log('🌴 [tanstack-devtools] WebSocket server stopped')
    })
    this.#clients.clear()
    this.#sseClients.forEach((res) => res.end())
    this.#sseClients.clear()
    this.#server = null
    this.#wssServer = null
    console.log('[tanstack-devtools] All connections cleared')
  }

  private createSSEServer() {
    if (this.#server) {
      return this.#server
    }
    const server = http.createServer((req, res) => {
      if (req.url === '/__devtools/sse') {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          'Access-Control-Allow-Origin': '*',
        })
        res.write('\n')
        this.#sseClients.add(res)
        req.on('close', () => this.#sseClients.delete(res))
        return
      }

      if (req.url === '/__devtools/send' && req.method === 'POST') {
        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', () => {
          try {
            const msg = JSON.parse(body)
            console.log('Received message from SSE:', msg)
            this.emit(msg)
          } catch {}
        })
        res.writeHead(200).end()
        return
      }

      res.statusCode = 404
      res.end()
    })
    globalThis.__DEVTOOLS_SERVER__ = server
    this.#server = server
    return server
  }

  private createWebSocketServer() {
    if (this.#wssServer) {
      return this.#wssServer
    }

    const wss = new WebSocketServer({ noServer: true })
    this.#wssServer = wss
    globalThis.__DEVTOOLS_WSS_SERVER__ = wss
    return wss
  }

  private handleNewConnection(wss: WebSocketServer) {
    wss.on('connection', (ws: WebSocket) => {
      this.#clients.add(ws)
      ws.on('close', () => this.#clients.delete(ws))
      ws.on('message', (msg) => {
        const data = JSON.parse(msg.toString())
        console.log('Received message from WebSocket:', data)
        this.emit(data)
      })
    })
  }

  start() {
    if (process.env.NODE_ENV !== 'development') return
    if (this.#server || this.#wssServer) {
      console.warn('🌴 [tanstack-devtools] Server is already running')
      return
    }

    const server = this.createSSEServer()
    const wss = this.createWebSocketServer()

    this.handleNewConnection(wss)

    // Handle connection upgrade for WebSocket
    server.on('upgrade', (req, socket, head) => {
      if (req.url === '/__devtools/ws') {
        wss.handleUpgrade(req, socket, head, (ws) => {
          wss.emit('connection', ws, req)
        })
      }
    })

    server.listen(this.#port, () => {
      console.log(
        `🌴 [tanstack-devtools] Listening on http://localhost:${this.#port}`,
      )
    })
  }
}
