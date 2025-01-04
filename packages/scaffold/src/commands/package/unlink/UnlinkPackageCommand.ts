import { Command, Option } from 'clipanion'
import { updateJSONFile } from '../../../fs.js'
import { moduleName, packagePath } from '../../../workspace.js'
import { relative } from 'node:path'
import { $ } from 'zx'

export class UnlinkPackageCommand extends Command {
  static override paths = [['package', 'unlink']]

  static override usage = Command.Usage({
    category: 'package',
    description: 'Unlink one package from another',
  })

  readonly src = Option.String({
    name: 'source',
    required: true,
  })

  readonly dest = Option.String({
    name: 'destination',
    required: true,
  })

  get srcPackagePath() {
    return packagePath(this.src)
  }

  get destPackagePath() {
    return packagePath(this.dest)
  }

  override async execute() {
    await this.#removeTSConfigReference()
    await this.#uninstall()
  }

  async #removeTSConfigReference() {
    await updateJSONFile<any>(
      `${this.destPackagePath}/tsconfig.json`,
      (tsconfig) => ({
        ...tsconfig,
        references: tsconfig.references?.filter(
          (reference: any) =>
            reference.path !==
            relative(this.destPackagePath, this.srcPackagePath),
        ),
      }),
    )
  }

  async #uninstall() {
    const $$ = $({ cwd: this.destPackagePath, verbose: true })
    await $$`yarn remove ${moduleName(this.src)}`
  }
}
