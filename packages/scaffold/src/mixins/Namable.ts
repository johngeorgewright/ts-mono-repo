import { Option } from 'clipanion'
import { BaseConstructor } from './BaseConstructor.js'
import { moduleName } from '../workspace.js'

export function Namable<TBase extends BaseConstructor>(Base: TBase) {
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
