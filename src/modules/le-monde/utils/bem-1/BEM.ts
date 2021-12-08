export type BlockNameArg = string|string[]
export type ElementNameArg = BlockNameArg
export interface ModifierNamesObjArg { [key: string]: boolean }
export type ModifierNameArg = string|string[]|ModifierNamesObjArg

export interface Block {
  name: string
  modifiers: string[]
}

class BEM {
  constructor () {
    this.findBlockByName = this.findBlockByName.bind(this)
    this.addBlock = this.addBlock.bind(this)
    this.addElement = this.addElement.bind(this)
    this.addModifier = this.addModifier.bind(this)
    this.addSingleBlock = this.addSingleBlock.bind(this)
    this.addSingleElement = this.addSingleElement.bind(this)
    this.addSingleModifier = this.addSingleModifier.bind(this)
    this.normalizeBlockNameArg = this.normalizeBlockNameArg.bind(this)
    this.setCurrentBlockByName = this.setCurrentBlockByName.bind(this)
    this.createBlockByName = this.createBlockByName.bind(this)
    this.getCurrentBlock = this.getCurrentBlock.bind(this)
  }

  private blocks: Block[] = []

  private findBlockByName (name: string) {
    return this.blocks.find(block => block.name === name)
  }

  addBlock (blockNameArg: BlockNameArg): BEM {
    const blockNames = this.normalizeBlockNameArg(blockNameArg)
    blockNames.forEach(this.addSingleBlock)
    return this
  }

  addElement (elementNameArg: ElementNameArg): BEM {
    const elementNames = this.normalizeBlockNameArg(elementNameArg)
    elementNames.forEach(this.addSingleElement)
    return this
  }

  addModifier (modifierNameArg: ModifierNameArg): BEM {
    const currentBlock = this.getCurrentBlock()
    if (currentBlock === undefined) return this
    if (typeof modifierNameArg !== 'string' && !Array.isArray(modifierNameArg)) {
      Object.entries(modifierNameArg).forEach(([modifierName, value]) => {
        if (value) {
          const modifiersNames = this.normalizeBlockNameArg(modifierName)
          modifiersNames.forEach(this.addSingleModifier)
        }
      })
    } else if (typeof modifierNameArg === 'string') {
      const modifiersNames = this.normalizeBlockNameArg(modifierNameArg)
      modifiersNames.forEach(this.addSingleModifier)
    } else {
      modifierNameArg.forEach(modifierNameArg => {
        const modifiersNames = this.normalizeBlockNameArg(modifierNameArg)
        modifiersNames.forEach(this.addSingleModifier)
      })
    }
    return this
  }

  copy (): BEM {
    const copy = new BEM()
    this.blocks.forEach(block => {
      copy.addBlock(block.name)
      block.modifiers.forEach(modifier => {
        copy.addModifier(modifier)
      })
    })
    return copy
  }

  block (blockNameArg: BlockNameArg): BEM {
    const copy = this.copy()
    copy.addBlock(blockNameArg)
    return copy
  }

  element (elementNameArg: ElementNameArg): BEM {
    const copy = this.copy()
    copy.addElement(elementNameArg)
    return copy
  }

  modifier (modifierNameArg: ModifierNameArg): BEM {
    const copy = this.copy()
    copy.addModifier(modifierNameArg)
    return copy
  }

  blk (blockNameArg: BlockNameArg): BEM {
    return this.block(blockNameArg)
  }

  elt (elementNameArg: ElementNameArg): BEM {
    return this.element(elementNameArg)
  }

  mod (modifierNameArg: ModifierNameArg): BEM {
    return this.modifier(modifierNameArg)
  }

  private addSingleBlock (blockName: string): BEM {
    if (this.findBlockByName(blockName) !== undefined) {
      this.setCurrentBlockByName(blockName)
    } else {
      const block = this.createBlockByName(blockName)
      this.blocks.push(block)
    }
    return this
  }

  private addSingleElement (elementName: string): BEM {
    const currentBlock = this.getCurrentBlock()
    if (currentBlock === undefined) this.addBlock(elementName)
    else { currentBlock.name = currentBlock.name + '__' + elementName }
    return this
  }

  private addSingleModifier (modifierName: string): BEM {
    const currentBlock = this.getCurrentBlock()
    if (currentBlock !== undefined) {
      currentBlock.modifiers.push(modifierName)
    }
    return this
  }

  private normalizeBlockNameArg (blockNameArg: BlockNameArg) {
    const normalized: string[] = []
    if (typeof blockNameArg === 'string') {
      const splTrimmedBlockNameArg = blockNameArg
        .split(/\s/gi)
        .map(e => e.trim())
        .filter(e => e !== '')
      splTrimmedBlockNameArg.forEach(e => normalized.push(e))
    } else {
      blockNameArg.forEach(nestedBlockNameArg => {
        const splTrimmedBlockNameArg = this.normalizeBlockNameArg(nestedBlockNameArg)
        splTrimmedBlockNameArg.forEach(e => normalized.push(e))
      })
    }
    return normalized
  }

  private setCurrentBlockByName (blockName: string): BEM {
    const block = this.findBlockByName(blockName)
    if (block !== undefined) {
      const blockPos = this.blocks.indexOf(block)
      this.blocks = [
        ...this.blocks.slice(0, blockPos),
        ...this.blocks.slice(blockPos + 1),
        block
      ]
    }
    return this
  }

  private createBlockByName (blockName: string): Block {
    return { name: blockName, modifiers: [] }
  }

  private getCurrentBlock (): Block|undefined {
    return this.blocks.slice(-1)[0]
  }
}

export default BEM
