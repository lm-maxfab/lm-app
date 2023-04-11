import {
  makeTransformer,
  getTransformer
} from '../..'
import { TransformerType } from '../../types'

export default makeTransformer(
  'map',
  TransformerType.MANY_TO_MANY,
  (value, argsStr, resolver) => {
    const [transformerName, ...otherArgs] = argsStr.split(' ')
    const transformer = getTransformer(transformerName)
    try {
      if (transformer === undefined) return value
      if (transformer.type !== TransformerType.ONE_TO_ONE) return value
      return value.map(val => {
        return transformer.apply(val, otherArgs.join(' '), resolver)
      })
    } catch (err) {
      return value
    }
  }
)
