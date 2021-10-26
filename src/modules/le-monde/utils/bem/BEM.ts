// export default class BEM {
//   static classNameRegex = /-?[_a-zA-Z]+[_a-zA-Z0-9-]*/
//   blockName: string
//   elements: BEM[] = []
//   modifiers: 

import bem from "."

//   constructor (blockName: string) {
//     if (!blockName.match(BEM.classNameRegex)) throw new Error('BEM block name must be a valid CSS class name')
//     this.blockName = blockName
//   }
// }


class BEMBlock {
  name: string
  constructor (name: string) {
    this.name = name
  }

  elt (eltName: string) {
    return new BEMElement (this.valueOf(), eltName)
  }

  mod (modName: string) {
    return new BEMModifier(this.valueOf(), modName)
  }

  valueOf () {
    return this.name
  }
}

class BEMElement {
  root: string
  name: string
  constructor (root: string, name: string) {
    this.root = root
    this.name = name
  }

  elt (eltName: string) {
    return new BEMElement(this.valueOf(), eltName)
  }

  mod (modName: string) {
    return new BEMModifier(this.valueOf(), modName)
  }

  valueOf () {
    return `${this.root}__${this.name}`
  }
}

class BEMModifier {
  constructor (root: string, name: string) {
    this.root = root
    this.name = name
  }


}

// class BEMModifier {
//   name: string
//   constructor (name: string) {
//     this.name = name
//   }


// }


// function bem (name: string) {
//   return new BEM(name)
// }



// bem('lm-app') // 'lm-app'
//   .elt('cover') // 'lm-app__cover'
//   .mod('active') // 'lm-app__cover lm-app__cover_active
//   .mod('dark') // 'lm-app__cover lm-app__cover_active lm-app__cover_dark


// bem('lm-app')
//   .mod()

// export class BEMElement {
//   static elementNameRegex = /$[a-zA-Z0-9](([a-zA-Z0-9-_])?[a-zA-Z0-9])?*/
//   _name: string
//   _modifiers: string[] = []

//   constructor (name: string) {
//     if (!name.match(BEMElement.elementNameRegex)) throw new Error('BEM element name must be a valid CSS class name. Cannot use ${elementName} as an element name.')
//     this._name = name
//   }

//   get name () {
//     return this._name
//   }

//   get modifiers () {
//     return [...new Set(this._modifiers)]
//   }

//   mod (_modifiers: string|string[]) {
//     const rawModifiers = Array.isArray(_modifiers) ? _modifiers : [_modifiers]
//     let newModifiers: string[] = []
//     rawModifiers.forEach(rawModifier => {
//       rawModifier.split(' ').forEach(chunk => {
//         if (chunk === '') return
//         if (!rawModifier.match(BEMElement.elementNameRegex)) throw new Error(`BEM modifier name must be a valid CSS class name. Cannot use ${chunk} as a modifier name.`)
//         newModifiers.push(chunk)
//       })
//     })
//     this._modifiers.push(...newModifiers)
//   }

//   valueOf () {
//     return this.modifiers.map(mod => `${this.name}_${mod}`)
//   }
// }

// export class BEMBlock extends BEMElement {
//   constructor (name: string) {

//   }
// }
