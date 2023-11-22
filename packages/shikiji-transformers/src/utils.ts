import type { Element } from 'hast'

/**
 * Check if a node is comment-like,
 * e.g. `<!-- comment -->`, `/* comment ..`, `// comment`
 */
export function isCommentLike(node: Element, line: Element) {
  if (node.children?.[0].type !== 'text')
    return false
  const text = node.children[0].value.trim()
  if (text.startsWith('<!--') && text.endsWith('-->'))
    return true
  if (text.startsWith('/*') && text.endsWith('*/'))
    return true
  if (text.startsWith('//') && line.children.indexOf(node) === line.children.length - 1)
    return true
  return false
}
