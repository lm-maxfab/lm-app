interface ModifiersObj { [key: string]: boolean }
type ModifiersArr = string[]

class BEMBlock {
  name: string
  modifiers: string[]

  constructor (name: string) {
    this.name = name
    this.modifiers = []
    this.addElement = this.addElement.bind(this)
    this.addModifier = this.addModifier.bind(this)
    this.copy = this.copy.bind(this)
    this.element = this.element.bind(this)
    this.modifier = this.modifier.bind(this)
    this.elt = this.elt.bind(this)
    this.mod = this.mod.bind(this)
  }

  addElement (name: string): BEMBlock {
    this.name = `${this.name}__${name}`
    return this
  }

  addModifier (name: string): BEMBlock {
    this.modifiers.push(name)
    return this
  }

  copy (): BEMBlock {
    const copy = new BEMBlock(this.name)
    this.modifiers.forEach(mod => copy.addModifier(mod))
    return copy
  }

<<<<<<< HEAD
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
=======
  element (name: string): BEMBlock {
    return this.copy().addElement(name)
  }

  modifier (name: string): BEMBlock {
    return this.copy().addModifier(name)
  }

  elt (name: string): BEMBlock {
    return this.element(name)
  }

  mod (name: string): BEMBlock {
    return this.modifier(name)
  }

  get value (): string {
>>>>>>> master
    return [this.name, ...this.modifiers.map(mod => `${this.name}_${mod}`)].join(' ')
  }
}

export class BEM {
  blocks: BEMBlock[] = []
  currentBlock: BEMBlock|null = null

  constructor () {
    this.addBlock = this.addBlock.bind(this)
    this.addElement = this.addElement.bind(this)
    this.addModifier = this.addModifier.bind(this)
    this.copy = this.copy.bind(this)
    this.block = this.block.bind(this)
    this.element = this.element.bind(this)
    this.modifier = this.modifier.bind(this)
    this.blk = this.blk.bind(this)
    this.elt = this.elt.bind(this)
    this.mod = this.mod.bind(this)
    this.toString = this.toString.bind(this)
  }

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
        if (!value) return
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
    return this.block(name)
  }

  elt (name: string|undefined): BEM {
    return this.element(name)
  }

  mod (name: string|ModifiersObj|ModifiersArr|undefined): BEM {
    return this.modifier(name)
  }

  get value (): string {
    return this.blocks.map(block => block.value).join(' ')
  }

<<<<<<< HEAD
  toString () {
=======
  toString (): string {
>>>>>>> master
    return this.value
  }
}

export default function bem (blockName: string): BEM {
  const newBem = new BEM()
  newBem.addBlock(blockName)
  return newBem
}
