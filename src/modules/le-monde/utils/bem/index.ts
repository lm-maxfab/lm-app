import BEM from './BEM'
import getNamesArr from './getNamesArr'

function bem (blockNameArg: any) {
  const bem = new BEM()
  return bem.addBlock(blockNameArg)
}

export { BEM, getNamesArr, bem }
export default bem
