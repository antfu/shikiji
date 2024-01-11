import type { Element } from 'hast'
import type { TokenCompletion } from 'twoslashes'
import completionIcons from './icons-completions.json'
import tagIcons from './icons-tags.json'

export type CompletionItem = NonNullable<TokenCompletion['completions']>[number]

export const defaultCompletionIcons: Record<CompletionItem['kind'], Element | undefined> = completionIcons as any
export const defaultCustomTagIcons: Record<string, Element | undefined> = tagIcons as any
