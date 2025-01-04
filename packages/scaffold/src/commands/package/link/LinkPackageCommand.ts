import { Command, Option } from 'clipanion'
import { moduleName, packagePath } from '../../../workspace.js'
import { readFile, writeFile } from 'node:fs/promises'
import { relative } from 'node:path'

export class LinkPackageCommand extends Command {
  static override paths = [['package', 'link']]

  static override usage = Command.Usage({
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
    const srcTSConfigPath = `${this.srcPackagePath}/tsconfig.json`
    const destTSConfigPath = `${this.destPackagePath}/tsconfig.json`

    const srcTSConfigJSON = JSON.parse(await readFile(srcTSConfigPath, 'utf-8'))
    const destTSConfigJSON = JSON.parse(
      await readFile(destTSConfigPath, 'utf-8'),
    )

    if (!srcTSConfigJSON.composite) {
      srcTSConfigJSON.composite = true
      await writeFile(srcTSConfigPath, JSON.stringify(srcTSConfigJSON, null, 2))
    }

    destTSConfigJSON.references ??= []
    destTSConfigJSON.references.push({
      path: relative(this.destPackagePath, this.srcPackagePath),
    })

    await writeFile(destTSConfigPath, JSON.stringify(destTSConfigJSON, null, 2))
  }

  async #install() {
    const { $ } = await import('zx')
    const $$ = $({ cwd: this.destPackagePath, verbose: true })

    await $$`yarn add ${this.dev ? '-D' : ''} ${moduleName(this.src)}`
  }
}
