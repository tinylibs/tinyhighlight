import { it, expect } from 'vitest'
import { highlight } from '../src/picocolors.js'

it('should highlight code', () => {
  const code = `
import 'module'
import { test } from 'module'
import * as module from 'module'
import module from 'module'
function test() {}
const test = () => {}
class Test {}
export default test
export const test = 'test'
export function test() {}
export class Test {}
export * as test from 'module'
export * from 'module'
export { test } from 'module'
export { test as test2 } from 'module'
const string = "test"
const string = \`test\`
const string = \`dsdsdt$\{test\}st\`
const string = \`d\$\{SOE\}dsdt$\{test\}st\`
const regexp = /test/
const test = (() => {})()
test?.()
test!()
test ()
test
()
{
  console.log('test')
}
/**
 * test
 */
/** test */
// test
  `
  expect(highlight(code)).toMatchSnapshot()
})

it('should highlight jsx code', () => {
  const code = `
function Test() {
  return <div>test</div>
}

function Test() {
  return <div>{'test'}</div>
}

function Test() {
  return (
    <>
      <div>test</div>
      <div>test</div>
    </>
  )
}

function Invalid() {
  return </div>{test}<div>
}
  `
  expect(highlight(code, { jsx: true })).toMatchSnapshot()
})

it('renders html-like file simillar to jsx', () => {
  const html = `
<div class="test">test</div>
<script setup lang="ts">
console.log("test")
</script>
  `
  expect(highlight(html, { jsx: true })).toMatchSnapshot()
})

it('renders html-like file without jsx setting', () => {
  const html = `
<div class="test">test</div>
<script setup lang="ts">
console.log("test")
</script>
  `
  expect(highlight(html, { jsx: false })).toMatchSnapshot()
})