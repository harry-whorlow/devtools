import { ServerEventBus } from '@tanstack/devtools-event-bus/server'

const devtoolsServer = new ServerEventBus()

devtoolsServer.start()

export { devtoolsServer }
