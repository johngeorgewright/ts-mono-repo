import { Option } from 'clipanion'
import { AbstractConstructor } from './AbstractConstructor.js'
import { moduleName } from '../workspace.js'

export function Namable<TBase extends AbstractConstructor>(Base: TBase) {
  abstract class Namable extends Base {
    readonly name = Option.String({
      name: 'name',
      required: true,
    })

    get moduleName() {
      return moduleName(this.name)
    }

    get packagePath() {
      return `packages/${this.name}`
    }
  }

  return Namable
}
