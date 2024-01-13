export function parseHighlightWords(attrs: string): string[] | null {
  if (!attrs)
    return null

  const match = [...attrs.matchAll(/\/(\w+)\//g)]
  if (!match)
    return null

  return match.map(arr => arr[1])
}
