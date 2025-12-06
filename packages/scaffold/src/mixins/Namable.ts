import { Option } from 'clipanion'
import { BaseConstructor } from './BaseConstructor.js'
import { moduleName, withoutNS } from '../workspace.js'

export function Namable<TBase extends BaseConstructor>(Base: TBase) {
  abstract class Namable extends Base {
    private readonly _name = Option.String({
      name: 'name',
      required: true,
    })

    get name() {
      return withoutNS(this._name)
    }

    get moduleName() {
      return moduleName(this._name)
    }

    get packagePath() {
      return `packages/${this.name}`
    }
  }

  return Namable
}
