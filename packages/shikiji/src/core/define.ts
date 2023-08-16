import type { ShikiContext } from '..'

export interface ShikiRenderer<Contribution extends Record<string, (...args: any[]) => any>> {
  (context: ShikiContext): Contribution
}

export function defineShikiRenderer<T extends Record<string, (...args: any[]) => any>>(setup: ShikiRenderer<T>) {
  return setup
}
