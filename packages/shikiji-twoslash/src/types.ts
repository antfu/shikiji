import type { NodeCompletion, NodeError, NodeHover, NodeQuery, NodeTag, TwoSlashOptions, TwoSlashReturn, twoslasher } from 'twoslashes'
import type { CodeToHastOptions, ShikijiTransformerContext } from 'shikiji-core'
import type { Element, ElementContent, Text } from 'hast'

declare module 'shikiji-core' {
  interface ShikijiTransformerContextMeta {
    twoslash?: TwoSlashReturn
  }
}

export interface TransformerTwoSlashOptions {
  /**
   * Languages to apply this transformer to
   */
  langs?: string[]
  /**
   * Requires `twoslash` to be presented in the code block meta to apply this transformer
   *
   * @default false
   */
  explicitTrigger?: boolean
  /**
   * Mapping from language alias to language name
   */
  langAlias?: Record<string, string>
  /**
   * Custom filter function to apply this transformer to
   * When specified, `langs` and `explicitTrigger` will be ignored
   */
  filter?: (lang: string, code: string, options: CodeToHastOptions) => boolean
  /**
   * Custom instance of twoslasher function
   */
  twoslasher?: typeof twoslasher
  /**
   * Options to pass to twoslash
   */
  twoslashOptions?: TwoSlashOptions
  /**
   * Custom renderers to decide how each info should be rendered
   */
  renderer?: TwoSlashRenderer
  /**
   * Strictly throw when there is an error
   * @default true
   */
  throws?: boolean
}

export interface TwoSlashRenderer {
  lineError?(this: ShikijiTransformerContext, error: NodeError): ElementContent[]
  lineCustomTag?(this: ShikijiTransformerContext, tag: NodeTag): ElementContent[]
  lineQuery?(this: ShikijiTransformerContext, query: NodeQuery, targetNode?: Element | Text): ElementContent[]
  lineCompletions?(this: ShikijiTransformerContext, query: NodeCompletion): ElementContent[]

  nodeError?(this: ShikijiTransformerContext, error: NodeError, node: Element | Text): Partial<ElementContent>
  nodeStaticInfo(this: ShikijiTransformerContext, info: NodeHover, node: Element | Text): Partial<ElementContent>
  nodeQuery?(this: ShikijiTransformerContext, query: NodeQuery, node: Element | Text): Partial<ElementContent>
  nodeCompletions?(this: ShikijiTransformerContext, query: NodeCompletion, node: Element | Text): Partial<ElementContent>
}
