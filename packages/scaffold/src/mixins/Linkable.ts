import { Option } from 'clipanion'
import { packagePath } from '../workspace.js'
import { AbstractConstructor } from './AbstractConstructor.js'

export function Linkable<TBase extends AbstractConstructor>(Base: TBase) {
  abstract class Linkable extends Base {
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
  }

  return Linkable
}
