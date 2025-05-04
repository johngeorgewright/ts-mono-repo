import { updateJSONFile } from '../../../fs.js'
import { moduleName } from '../../../workspace.js'
import { relative } from 'node:path'
import { BaseCommand } from '../../BaseCommand.js'
import { Linkable } from '../../../mixins/Linkable.js'

export class UnlinkPackageCommand extends Linkable(BaseCommand) {
  static override paths = [['package', 'unlink']]

  static override usage = BaseCommand.Usage({
    category: 'package',
    description: 'Unlink one package from another',
  })

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
    const $$ = this.context.$({ cwd: this.destPackagePath })
    await $$`bun remove ${moduleName(this.src)}`
  }
}
