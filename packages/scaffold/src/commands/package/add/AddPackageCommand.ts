import * as path from 'node:path'
import { MustacheGeneratorCommand } from '../../MustacheGeneratorCommand.js'
import { Option } from 'clipanion'
import { packagesPath } from '../../../workspace.js'
import { Namable } from '../../../mixins/Namable.js'
import { updateJSONFile } from '../../../fs.js'

const modulePath = module.path || __dirname

export class AddPackageCommand extends Namable(MustacheGeneratorCommand) {
  static override paths = [['package', 'add']]

  static override usage = MustacheGeneratorCommand.Usage({
    category: 'package',
    description: 'Create a new package in this workspace',
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

  readonly year = new Date().getFullYear()

  override async execute() {
    this.templateDir = path.join(modulePath, 'templates')
    await super.execute()

    if (this.public) {
      this.templateDir = path.join(modulePath, 'templates-public')
      await super.execute()
    }

    await this.#installDependencies()
    await this.#addTSConfigReference()
  }

  async #installDependencies() {
    const $$ = this.context.$({
      cwd: this.destinationDir,
    })
    await $$`bun install`
    await $$`bun add tslib`
    await $$`bun add --dev \
      @types/bun@catalog: \
      typescript@catalog:`
  }

  async #addTSConfigReference() {
    await updateJSONFile<any>('tsconfig.json', (data) => {
      data.references ??= []
      data.references.push({ path: this.destinationDir })
    })
  }
}
