import BEM from './BEM'

export default function bem (blockName: string) {
  return new BEM(blockName)
}
