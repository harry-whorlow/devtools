import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateReferenceDocs } from '@tanstack/config/typedoc'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/** @type {import('@tanstack/config/typedoc').Package[]} */
const packages = [
  {
    name: 'devtools',
    entryPoints: [resolve(__dirname, '../packages/devtools/src/index.ts')],
    tsconfig: resolve(__dirname, '../packages/devtools/tsconfig.docs.json'),
    outputDir: resolve(__dirname, '../docs/reference'),
  },
  {
    name: 'react-devtools',
    entryPoints: [
      resolve(__dirname, '../packages/react-devtools/src/index.ts'),
    ],
    tsconfig: resolve(
      __dirname,
      '../packages/react-devtools/tsconfig.docs.json',
    ),
    outputDir: resolve(__dirname, '../docs/framework/react/reference'),
    exclude: ['packages/devtools/**/*'],
  },
  {
    name: 'solid-devtools',
    entryPoints: [
      resolve(__dirname, '../packages/solid-devtools/src/index.ts'),
    ],
    tsconfig: resolve(
      __dirname,
      '../packages/solid-devtools/tsconfig.docs.json',
    ),
    outputDir: resolve(__dirname, '../docs/framework/solid/reference'),
    exclude: ['packages/devtools/**/*'],
  },
]

await generateReferenceDocs({ packages })

process.exit(0)
