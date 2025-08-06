import { TanstackDevtoolsServerEventBus } from '@tanstack/devtools-event-bus/server'

const devtoolsServer = new TanstackDevtoolsServerEventBus()

devtoolsServer.start()

export { devtoolsServer }
