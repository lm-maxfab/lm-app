import { Transformer, TransformerInput } from '..'

const lowerCase: Transformer = (value: TransformerInput, args: string[]) => {
  return value?.toString().toLowerCase() ?? ''
}

export default lowerCase
