interface ModifiersObj { [key: string]: boolean }
type ModifiersArr = string[]

class BEMBlock {
  name: string
  modifiers: string[]
  
  constructor (name: string) {
    this.name = name
    this.modifiers = []
  }

  addElement (name: string) {
    this.name = `${this.name}__${name}`
    return this
  }

  addModifier (name: string) {
    this.modifiers.push(name)
    return this
  }

  copy () {
    const copy = new BEMBlock(this.name)
    this.modifiers.forEach(mod => copy.addModifier(mod))
    return copy
  }

  element (name: string) {
    return this.copy().addElement(name)
  }

  modifier (name: string) {
    return this.copy().addModifier(name)
  }

  elt (name: string) {
    return this.element(name)
  }

  mod (name: string) {
    return this.modifier(name)
  }

  get value () {
    return [this.name, ...this.modifiers.map(mod => `${this.name}_${mod}`)].join(' ')
  }
}

export class BEM {
  blocks: BEMBlock[] = []
  currentBlock: BEMBlock|null = null

  addBlock (name: string): BEM {
    const newBlock = new BEMBlock(name)
    this.blocks.push(newBlock)
    this.currentBlock = newBlock
    return this
  }

  addElement (name: string): BEM {
    if (this.currentBlock === null) return this.addBlock(name)
    this.currentBlock.addElement(name)
    return this
  }

  addModifier (name: string|ModifiersObj|ModifiersArr): BEM {
    if (this.currentBlock === null) this.addBlock('')
    if (typeof name === 'string') (this.currentBlock as unknown as BEMBlock).addModifier(name)
    else if (Array.isArray(name)) {
      name.forEach(name => (this.currentBlock as unknown as BEMBlock).addModifier(name))
    } else {
      Object.entries(name).forEach(([key, value]) => {
        if (value !== true) return
        (this.currentBlock as unknown as BEMBlock).addModifier(key)
      })
    }
    return this
  }

  copy (): BEM {
    const copy = new BEM()
    copy.blocks.push(...this.blocks.map(block => block.copy()))
    if (this.currentBlock === null) copy.currentBlock = null
    else {
      const currentBlockPos = this.blocks.indexOf(this.currentBlock)
      copy.currentBlock = copy.blocks[currentBlockPos]
    }
    return copy
  }

  block (name: string|undefined): BEM {
    if (name === undefined) return this.copy()
    return this.copy().addBlock(name)
  }

  element (name: string|undefined): BEM {
    if (name === undefined) return this.copy()
    return this.copy().addElement(name)
  }

  modifier (name: string|ModifiersObj|ModifiersArr|undefined): BEM {
    if (name === undefined) return this.copy()
    return this.copy().addModifier(name)
  }

  blk (name: string|undefined): BEM {
    if (name === undefined) return this.copy()
    return this.block(name)
  }

  elt (name: string|undefined): BEM {
    if (name === undefined) return this.copy()
    return this.element(name)
  }

  mod (name: string|ModifiersObj|ModifiersArr|undefined): BEM {
    if (name === undefined) return this.copy()
    return this.modifier(name)
  }

  get value () {
    return this.blocks.map(block => block.value).join(' ')
  }

  toString () {
    return this.value
  }
}

export default function bem (blockName: string): BEM {
  const newBem = new BEM()
  newBem.addBlock(blockName)
  return newBem
}
