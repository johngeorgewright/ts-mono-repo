import { readFile, writeFile } from 'node:fs/promises'
import * as path from 'node:path'

export const MODULE_PREFIX = '@johngeorgewright/'

export const moduleName = (name: string) => MODULE_PREFIX + name

export const projectRootPath = path.resolve(
  module.path || __dirname,
  '..',
  '..',
  '..',
)

export const packagesPath = path.join(projectRootPath, 'packages')

export const packagePath = (name: string) => path.join(packagesPath, name)

export const vsCodeWorkspacePath = path.join(
  projectRootPath,
  'ts-mono-repo.code-workspace',
)

export async function updateVSCodeWorkspace(
  update: (workspace: VSCodeWorkspace) => VSCodeWorkspace,
) {
  let workspace = JSON.parse((await readFile(vsCodeWorkspacePath)).toString())
  workspace = update(workspace)
  workspace.folders.sort((a: { name: string }, b: { name: string }) =>
    a.name.localeCompare(b.name),
  )
  await writeFile(vsCodeWorkspacePath, JSON.stringify(workspace, null, 2))
}

interface VSCodeWorkspace {
  extensions: { recommendations: string[] }
  folders: { name: string; path: string }[]
  settings: Record<string, any>
}
