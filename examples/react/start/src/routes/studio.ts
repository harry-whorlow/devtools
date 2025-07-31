import { createServerFileRoute } from '@tanstack/react-start/server'
import { createPrismaPostgresHttpClient } from '@prisma/studio-core/data/ppg'
import { serializeError } from '@prisma/studio-core/data/bff'

export const ServerRoute = createServerFileRoute('/studio').methods({
  POST: async ({ request }) => {
    const { query } = await request.json()
    // 2. Read DB URL from env vars
    const url = process.env.DATABASE_URL!

    // 3. Execute the query against Prisma Postgres
    const [error, results] = await createPrismaPostgresHttpClient({
      url,
    }).execute(query)

    if (error) {
      console.log(error)
      return new Response(JSON.stringify([serializeError(error)]), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
    return new Response(JSON.stringify([null, results]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
})
