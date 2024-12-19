import * as path from 'node:path'
import { $ } from 'zx'
import { MustacheGeneratorCommand } from '../../MustacheGeneratorCommand.js'
import { Option } from 'clipanion'
import { readFile, writeFile } from 'node:fs/promises'
import {
  moduleName,
  packagesPath,
  projectRootPath,
} from '../../../workspace.js'

const modulePath = module.path || __dirname

export class AddPackageCommand extends MustacheGeneratorCommand {
  static override paths = [['package', 'add']]

  static override usage = MustacheGeneratorCommand.Usage({
    category: 'package',
    description: 'Create a new package in this workspace',
  })

  override get templateDir() {
    return path.join(modulePath, 'templates')
  }

  name = Option.String('-n,--name', {
    description: 'The name of the package',
    required: true,
  })

  description = Option.String('-d,--description', {
    description: "What's your package about?",
    required: true,
  })

  public = Option.Boolean('-p,--public', false, {
    description: 'Will your package be published to NPM?',
  })

  destinationDirOption = Option.String('-o,--destinationDir', {
    description: `Default will be ${packagesPath}/[NAME]`,
  })

  override get destinationDir() {
    return this.destinationDirOption || path.join(packagesPath, this.name)
  }

  get moduleName() {
    return moduleName(this.name)
  }

  get packagePath() {
    return `packages/${this.name}`
  }

  year = new Date().getFullYear()

  override templateNameFilter = (templateName: string) =>
    this.public ? true : templateName !== '.releaserc.cjs'

  override async execute() {
    await super.execute()
    await this.#updateCodeWorkspace()
    await this.#installDependencies()
  }

  async #updateCodeWorkspace() {
    const workspacePath = path.join(
      projectRootPath,
      'ts-mono-repo.code-workspace',
    )

    const workspace = JSON.parse((await readFile(workspacePath)).toString())

    workspace.folders.push({
      name: `📦 ${this.moduleName}`,
      path: this.packagePath,
    })

    workspace.folders.sort((a: { name: string }, b: { name: string }) =>
      a.name.localeCompare(b.name),
    )

    await writeFile(workspacePath, JSON.stringify(workspace, null, 2))
  }

  async #installDependencies() {
    const $$ = $({
      cwd: this.destinationDir,
      verbose: true,
    })
    await $$`yarn`
    await $$`yarn add --cached --caret tslib`
    await $$`yarn add --cached --dev \
      @types/node \
      @types/prettier \
      eslint-plugin-jest \
      typescript \
      vitest`
    if (this.public)
      $$`yarn add --cached --dev \
        @semantic-release/changelog \
        @semantic-release/commit-analyzer \
        @semantic-release/exec \
        @semantic-release/git \
        @semantic-release/github \
        @semantic-release/release-notes-generator \
        semantic-release \
        semantic-release-monorepo`
  }
}
