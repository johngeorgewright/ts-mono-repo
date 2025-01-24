import * as path from 'node:path'
import { MustacheGeneratorCommand } from '../../MustacheGeneratorCommand.js'
import { Option } from 'clipanion'
import {
  moduleName,
  packagesPath,
  updateVSCodeWorkspace,
} from '../../../workspace.js'

const modulePath = module.path || __dirname

export class AddPackageCommand extends MustacheGeneratorCommand {
  static override paths = [['package', 'add']]

  static override usage = MustacheGeneratorCommand.Usage({
    category: 'package',
    description: 'Create a new package in this workspace',
  })

  readonly name = Option.String({
    name: 'name',
    required: true,
  })

  readonly description = Option.String({
    name: 'description',
    required: true,
  })

  readonly public = Option.Boolean('-p,--public', false, {
    description: 'Will your package be published to NPM?',
  })

  readonly destinationDirOption = Option.String('-o,--destinationDir', {
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

  readonly year = new Date().getFullYear()

  override async execute() {
    this.templateDir = path.join(modulePath, 'templates')
    await super.execute()

    if (this.public) {
      this.templateDir = path.join(modulePath, 'templates-public')
      await super.execute()
    }

    await this.#updateCodeWorkspace()
    await this.#installDependencies()
  }

  async #updateCodeWorkspace() {
    await updateVSCodeWorkspace((workspace) => ({
      ...workspace,
      folders: [
        ...workspace.folders,
        {
          name: `📦 ${this.moduleName}`,
          path: this.packagePath,
        },
      ],
    }))
  }

  async #installDependencies() {
    const $$ = this.context.$({
      cwd: this.destinationDir,
    })
    await $$`yarn`
    await $$`yarn add --cached --caret tslib`
    await $$`yarn add --cached --dev \
      @types/node \
      @types/prettier \
      eslint-plugin-jest \
      prettier \
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
