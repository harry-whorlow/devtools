import { DevtoolsClient } from '@tanstack/devtools/client'

const devtoolsClient = new DevtoolsClient()

devtoolsClient.connect()

export { devtoolsClient }
