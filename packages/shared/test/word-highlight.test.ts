import { expect, it } from 'vitest'
import { parseHighlightWords } from '../word-highlight'

it('parseHighlightLines', () => {
  expect(parseHighlightWords('')).toBe(null)
  expect(parseHighlightWords('/hello/')).toEqual(['hello'])
  expect(parseHighlightWords('/hello/ /world/')).toEqual(['hello', 'world'])

  // invalid inputs
  expect(parseHighlightWords('/hello world/')).toEqual([])
  expect(parseHighlightWords('//')).toEqual([])
})
