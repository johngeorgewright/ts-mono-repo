import { Option } from 'clipanion'
import { moduleName } from '../../../workspace.js'
import { relative } from 'node:path'
import { updateJSONFile } from '../../../fs.js'
import { BaseCommand } from '../../BaseCommand.js'
import { Linkable } from '../../../mixins/Linkable.js'

export class LinkPackageCommand extends Linkable(BaseCommand) {
  static override paths = [['package', 'link']]

  static override usage = BaseCommand.Usage({
    category: 'package',
    description: 'Link one package to another',
  })

  readonly dev = Option.Boolean('-D,--dev', false, {
    description: 'Link as a dev dependency',
  })

  override async execute() {
    await this.#addTSConfigReference()
    await this.#install()
  }

  async #addTSConfigReference() {
    await Promise.all([
      updateJSONFile<any>(
        `${this.srcPackagePath}/tsconfig.json`,
        (tsconfig) => ({
          ...tsconfig,
          compilerOptions: { ...tsconfig.compilerOptions, composite: true },
        }),
      ),

      updateJSONFile<any>(
        `${this.destPackagePath}/tsconfig.json`,
        (tsconfig) => {
          tsconfig.references ??= []
          tsconfig.references.push({
            path: relative(this.destPackagePath, this.srcPackagePath),
          })
          return tsconfig
        },
      ),
    ])
  }

  async #install() {
    const $$ = this.context.$({ cwd: this.destPackagePath, quote: (x) => x })
    await $$`bun add ${this.dev ? '-D' : ''} ${moduleName(this.src)}@workspace:*`
  }
}
