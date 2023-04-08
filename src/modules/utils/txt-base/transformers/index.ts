import { VNode } from 'preact'
import { Base, Collection, Entry, Field } from '..'
import lowerCase from './lowerCase'

export type TransformerInput =
  string|string[]
  |number|number[]
  |null|null[]
  |boolean|boolean[]
  |HTMLElement|HTMLElement[]
  |VNode|VNode[]
  |Base|Base[]
  |Collection|Collection[]
  |Entry|Entry[]
  |Field|Field[]

export type Transformer = (value: TransformerInput, args: string[]) => TransformerInput

const transformersNamesMap = new Map<string, Transformer>()
transformersNamesMap.set('lowerCase', lowerCase)

const transform = (value: TransformerInput, transformerDescriptor: string): TransformerInput => {
  const [transformerName, ...transformerStrArgs] = transformerDescriptor.split(/\s+/)
  const transformer = transformersNamesMap.get(transformerName)
  if (transformer === undefined) return value
  return transformer(value, transformerStrArgs ?? [])
}

export default transform
