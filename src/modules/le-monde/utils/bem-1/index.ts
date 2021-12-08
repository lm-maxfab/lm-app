import BEM, { BlockNameArg } from './BEM'

export default function (blockNameArg: BlockNameArg) {
  const bem = new BEM()
  return bem.addBlock(blockNameArg)
}
