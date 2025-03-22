import {
  packageNames,
  packagePath,
  packagesPath,
  updateVSCodeWorkspace,
} from '../../../workspace.js'
import { rm } from 'node:fs/promises'
import { Option } from 'clipanion'
import { BaseCommand } from '../../BaseCommand.js'

export class RemovePackageCommand extends BaseCommand {
  static override paths = [['package', 'remove']]

  static override usage = BaseCommand.Usage({
    category: 'package',
    description: 'Remove a package from this workspace',
  })

  readonly name = Option.String({
    name: 'name',
    required: true,
  })

  get packagePath() {
    return `packages/${this.name}`
  }

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
      this.#updateCodeWorkspace(),
    ])
    await this.context.$`yarn`
  }

  async #updateCodeWorkspace() {
    await updateVSCodeWorkspace((workspace) => ({
      ...workspace,
      folders: workspace.folders.filter(
        (folder: { path: string }) => folder.path !== this.packagePath,
      ),
    }))
  }

  async #unlinkAll() {
    for (const packageName of await packageNames()) {
      if (packageName === this.name) continue
      await this.cli.run(['package', 'unlink', this.name, packageName])
    }
  }
}
