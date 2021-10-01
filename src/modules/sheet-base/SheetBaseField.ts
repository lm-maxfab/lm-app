import { createElement, VNode } from 'preact'
import { SheetBaseValue } from './SheetBase'
import { SheetBaseCollectionValue } from './SheetBaseCollection'
import SheetBaseEntry, { SheetBaseEntryValue } from './SheetBaseEntry'
import StrToHtml from '../text/StrToHtml'

type FieldType = 'string'|'text'|'number'|'bigint'|'boolean'|'null'|'undefined'|'html'|'ref'

interface SheetBaseFieldDescriptor {
  name: string
  description?: string
  type?: FieldType
  raw?: string
  parentEntry?: SheetBaseEntry
}

type SheetBaseFieldValue = string|number|bigint|boolean|null|undefined|VNode|SheetBaseValue|SheetBaseCollectionValue|SheetBaseEntryValue

class SheetBaseField {
  #name: string
  #description: string
  #type: FieldType
  #raw: string
  #parentEntry: SheetBaseEntry

  constructor ({ name, description, type, raw, parentEntry }: SheetBaseFieldDescriptor) {
    this.#name = name
    this.#description = description ?? ''
    this.#type = type ?? 'text'
    this.#raw = raw ?? ''
    this.#parentEntry = parentEntry ?? new SheetBaseEntry({ id: 'untitled' })
  }

  get name () { return this.#name }
  get description () { return this.#description }
  get type () { return this.#type }
  get raw () { return this.#raw }
  get parentEntry () { return this.#parentEntry }
  get value (): SheetBaseFieldValue {
    switch (this.type) {
      case 'string':
      case 'text':
        if (this.raw === '') return
        return this.raw
      case 'number':
        if (this.raw === '') return
        const replacedCommas = this.raw.replace(/,/gm, '.')
        return window.parseFloat(replacedCommas)
      case 'bigint':
        if (this.raw === '') return
        return window.BigInt(this.raw)
      case 'boolean':
        if (this.raw === '') return
        const isTrue = this.raw.toLowerCase().trim() === '1'
          || this.raw.toLowerCase().trim() === 'true'
          || this.raw.toLowerCase().trim() === 'vrai'
        return isTrue
      case 'null':
        if (this.raw === '') return
        return null
      case 'undefined':
        return
      case 'html':
        if (this.raw === '') return
        return createElement(StrToHtml, { content: this.raw }, null)
      case 'ref':
        if (this.raw === '') return
        const [collection, entry, field] = this.raw.split('.')
        const parentBase = this.#parentEntry.parentCollection.parentBase
        if (entry === undefined) return parentBase.collection(collection)?.value
        else if (field === undefined) return parentBase.collection(collection)?.entry(entry)?.value
        else return parentBase.collection(collection)?.entry(entry)?.field(field)?.value
      default:
        return
    }
  }
}

export type { SheetBaseFieldDescriptor, SheetBaseFieldValue }
export default SheetBaseField
