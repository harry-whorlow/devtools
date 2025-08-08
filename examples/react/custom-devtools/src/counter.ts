import { DevtoolsEventClient } from './eventClient.ts'

export function createCounter() {
  let count = 0
  const history: Array<number> = []

  return {
    getCount: () => count,
    increment: () => {
      const newCount = count + 1
      history.push(count)

      // The emit eventSuffix must match that of the EventMap defined in eventClient.ts
      DevtoolsEventClient.emit('counter-state', {
        count: newCount,
        history: history,
      })

      count = newCount
    },
    decrement: () => {
      const newCount = count - 1
      history.push(count)

      DevtoolsEventClient.emit('counter-state', {
        count: newCount,
        history: history,
      })

      count = newCount
    },
  }
}
