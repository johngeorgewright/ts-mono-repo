import type { BaseContext } from 'clipanion'
import { $ } from 'zx'

export interface Context extends BaseContext {
  $: typeof $
}
