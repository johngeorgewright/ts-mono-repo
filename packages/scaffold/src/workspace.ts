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
