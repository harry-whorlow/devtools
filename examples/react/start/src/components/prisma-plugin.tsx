import { Studio } from '@prisma/studio-core/ui'
import { createPostgresAdapter } from '@prisma/studio-core/data/postgres-core'
import { createStudioBFFClient } from '@prisma/studio-core/data/bff'
import { useMemo } from 'react'

import '@prisma/studio-core/ui/index.css'

export function StudioPlugin() {
  const adapter = useMemo(() => {
    // 1. Create a client that points to your backend endpoint
    const executor = createStudioBFFClient({
      url: 'http://localhost:3000/studio',
    })

    // 2. Create a Postgres adapter with the executor
    const adapter = createPostgresAdapter({ executor })
    return adapter
  }, [])

  return <Studio adapter={adapter} />
}
