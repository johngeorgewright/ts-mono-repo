import { packageNames, packagePath, packagesPath } from '../../../workspace.js'
import { rm } from 'node:fs/promises'
import { Option } from 'clipanion'
import { BaseCommand } from '../../BaseCommand.js'
import { Namable } from '../../../mixins/Namable.js'
import { updateJSONFile } from '../../../fs.js'
import { without } from 'lodash'

export class RemovePackageCommand extends Namable(BaseCommand) {
  static override paths = [['package', 'remove']]

  static override usage = BaseCommand.Usage({
    category: 'package',
    description: 'Remove a package from this workspace',
  })

  readonly dirOption = Option.String('-d,--dir', {
    description: `Default will be ${packagesPath}/[NAME]`,
  })

  get dir() {
    return this.dirOption || packagePath(this.name)
  }

  override async execute() {
    await this.#unlinkAll()
    await Promise.all([
      rm(this.dir, { recursive: true }),
      this.#removeTSConfigReference(),
    ])
    await this.context.$`bun install`
  }

  async #unlinkAll() {
    for (const packageName of await packageNames()) {
      if (packageName === this.name) continue
      await this.cli.run(['package', 'unlink', this.name, packageName])
    }
  }

  async #removeTSConfigReference() {
    await updateJSONFile<any>('tsconfig.json', (data) => {
      if (data.references) {
        without(data.references, [this.dir])
      }
    })
  }
}
