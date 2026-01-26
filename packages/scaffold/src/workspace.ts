import { readdir } from 'node:fs/promises'
import * as path from 'node:path'
import rootPackageJSON from '../../../package.json' with { type: 'json' }
import { updateJSONFile } from './fs.js'
import { memoize } from 'lodash'

export const MODULE_NAMESPACE =
  /^(@[^\/]+)\//.exec(rootPackageJSON.name)?.[1] ?? ''

export const moduleName = (name: string) =>
  name.startsWith('@') ? name : `${MODULE_NAMESPACE}/${name}`

export const withoutNS = (name: string) =>
  name.startsWith('@') ? name.replace(`${MODULE_NAMESPACE}/`, '') : name

export const projectRootPath = path.resolve(
  module.path || __dirname,
  '..',
  '..',
  '..',
)

export const packagesPath = path.join(projectRootPath, 'packages')

export const packagePath = (name: string) => path.join(packagesPath, name)

export const relativePackagePath = (name: string) =>
  path.relative(projectRootPath, packagePath(name))

export const packageNames = async () => {
  const filenames = await readdir(packagesPath)
  return filenames.filter((filename) => !filename.startsWith('.'))
}

export const findVSCodeWorkspacePath = memoize(async () => {
  const filenames = await readdir(projectRootPath)
  const filename = filenames.find((filename) =>
    filename.endsWith('.code-workspace'),
  )
  if (!filename) throw new Error('No .code-workspace file found')
  return path.join(projectRootPath, filename)
})

export async function updateVSCodeWorkspace(
  update: (workspace: VSCodeWorkspace) => VSCodeWorkspace,
) {
  const vsCodeWorkspacePath = await findVSCodeWorkspacePath()
  await updateJSONFile<VSCodeWorkspace>(vsCodeWorkspacePath, (workspace) => {
    workspace = update(workspace)
    workspace.folders.sort((a, b) => a.name.localeCompare(b.name))
    return workspace
  })
}

interface VSCodeWorkspace {
  extensions: { recommendations: string[] }
  folders: { name: string; path: string }[]
  settings: Record<string, any>
}
