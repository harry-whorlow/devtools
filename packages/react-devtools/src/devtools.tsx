import React, { useEffect, useRef, useState } from 'react'
import { TanStackRouterDevtoolsCore } from '@tanstack/devtools'
import type { DevtoolsOptions } from '@tanstack/devtools'

export const Devtools = (opts: DevtoolsOptions) => {
  const devToolRef = useRef<HTMLDivElement>(null)
  const [devtools] = useState(() => new TanStackRouterDevtoolsCore(opts))
  useEffect(() => {
    if (devToolRef.current) {
      devtools.mount(devToolRef.current)
    }

    return () => {
      devtools.unmount()
    }
  }, [devtools])

  return <div ref={devToolRef} />
}
