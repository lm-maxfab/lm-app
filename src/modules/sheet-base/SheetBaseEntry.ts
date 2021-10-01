import SheetBaseCollection from './SheetBaseCollection'
import SheetBaseField, { SheetBaseFieldDescriptor, SheetBaseFieldValue } from './SheetBaseField'

interface SheetBaseEntryDescriptor {
  id: string
  parentCollection?: SheetBaseCollection
}

interface SheetBaseEntryValue {
  readonly [key: string]: SheetBaseFieldValue
}

class SheetBaseEntry {
  #id: string
  #parentCollection: SheetBaseCollection
  #fields: SheetBaseField[] = []

  constructor ({ id, parentCollection }: SheetBaseEntryDescriptor) {
    this.#id = id
    this.#parentCollection = parentCollection ?? new SheetBaseCollection({ name: 'untitled' })
  }

  get id () { return this.#id }
  get parentCollection () { return this.#parentCollection }

  createField (descriptor: SheetBaseFieldDescriptor) {
    const field = new SheetBaseField({ ...descriptor, parentEntry: this })
    const alreadyExistingField = this.field(field.name)
    if (alreadyExistingField !== undefined) {
      console.warn(`field '${field.name}' already exists and is gonna be overwridden`)
      this.dropField(field.name)
    }
    this.#fields.push(field)
    return field
  }

  dropField (name: string) {
    const newFields = this.#fields.filter(field => field.name !== name)
    if (newFields.length === this.#fields.length) return false
    this.#fields.splice(0, this.#fields.length, ...newFields)
    return true
  }

  get fields () {
    return this.#fields
  }

  get value () {
    const returned: SheetBaseEntryValue = {}
    Object.defineProperty(returned, 'id', { get: () => this.#id })
    for (const fld of this.#fields) Object.defineProperty(returned, fld.name, { get: () => fld.value })
    return returned
  }

  field (name: string) {
    return this.#fields.find(field => (field.name === name))
  }
}

export type { SheetBaseEntryDescriptor, SheetBaseEntryValue }
export default SheetBaseEntry
