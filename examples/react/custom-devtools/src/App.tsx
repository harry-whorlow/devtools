import { useState } from 'react'

import { createCounter } from './counter'

const counterInstance = createCounter()

export default function App() {
  const [count, setCount] = useState(counterInstance.getCount())

  const increment = () => {
    counterInstance.increment()
    setCount(counterInstance.getCount())
  }

  const decrement = () => {
    counterInstance.decrement()
    setCount(counterInstance.getCount())
  }

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>−</button>
    </div>
  )
}
