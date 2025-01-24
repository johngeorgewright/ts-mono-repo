import { Option } from 'clipanion'
import { moduleName, packagePath } from '../../../workspace.js'
import { relative } from 'node:path'
import { updateJSONFile } from '../../../fs.js'
import { BaseCommand } from '../../BaseCommand.js'

export class LinkPackageCommand extends BaseCommand {
  static override paths = [['package', 'link']]

  static override usage = BaseCommand.Usage({
    category: 'package',
    description: 'Link one package to another',
  })

  readonly dev = Option.Boolean('-D,--dev', false, {
    description: 'Link as a dev dependency',
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
    await this.#addTSConfigReference()
    await this.#install()
  }

  async #addTSConfigReference() {
    await updateJSONFile<any>(
      `${this.srcPackagePath}/tsconfig.json`,
      (tsconfig) => ({
        ...tsconfig,
        compilerOptions: { ...tsconfig.compilerOptions, composite: true },
      }),
    )

    await updateJSONFile<any>(
      `${this.destPackagePath}/tsconfig.json`,
      (tsconfig) => {
        tsconfig.references ??= []
        tsconfig.references.push({
          path: relative(this.destPackagePath, this.srcPackagePath),
        })
        return tsconfig
      },
    )
  }

  async #install() {
    const $$ = this.context.$({ cwd: this.destPackagePath })
    await $$`yarn add ${this.dev ? '-D' : ''} ${moduleName(this.src)}`
  }
}
