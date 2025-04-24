import { expect, test } from 'vitest'
import foo from '../src/index.js'

test('foo()', () => {
  expect(foo()).toBe('bar')
})
