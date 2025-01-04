import {
  packagePath,
  packagesPath,
  updateVSCodeWorkspace,
} from '../../../workspace.js'
import { rm } from 'node:fs/promises'
import { Command, Option } from 'clipanion'
import { $ } from 'zx'

export class RemovePackageCommand extends Command {
  static override paths = [['package', 'remove']]

  static override usage = Command.Usage({
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
    await Promise.all([
      rm(this.dir, { recursive: true }),
      this.#updateCodeWorkspace(),
    ])
    await $({ verbose: true })`yarn`
  }

  async #updateCodeWorkspace() {
    await updateVSCodeWorkspace((workspace) => ({
      ...workspace,
      folders: workspace.folders.filter(
        (folder: { path: string }) => folder.path !== this.packagePath,
      ),
    }))
  }
}
