import * as path from 'node:path'

export const projectRootPath = path.resolve(
  module.path || __dirname,
  '..',
  '..',
  '..',
)

export const packagesPath = path.join(projectRootPath, 'packages')

export const packagePath = (name: string) => path.join(packagesPath, name)
