import SheetBase from './SheetBase'
import SheetBaseEntry, {
  SheetBaseEntryDescriptor,
  SheetBaseEntryValue
} from './SheetBaseEntry'

interface SheetBaseCollectionDescriptor {
  name: string
  description?: string
  parentBase?: SheetBase
}

type SheetBaseCollectionValue = SheetBaseEntryValue[]

class SheetBaseCollection {
  _name: string
  _description: string
  _parentBase: SheetBase
  _entries: SheetBaseEntry[] = []

  constructor ({ name, description, parentBase }: SheetBaseCollectionDescriptor) {
    this._name = name
    this._description = description ?? ''
    this._parentBase = parentBase ?? new SheetBase()
  }

  get name () { return this._name }
  get description () { return this._description }
  get parentBase () { return this._parentBase }

  createEntry (descriptor: SheetBaseEntryDescriptor) {
    const entry = new SheetBaseEntry({ ...descriptor, parentCollection: this })
    const alreadyExistingEntry = this.strictEntry(entry.id)
    if (alreadyExistingEntry !== undefined) {
      console.warn(`entry '${entry.id}' already exists and is gonna be overwridden`)
      this.dropEntry(entry.id)
    }
    this._entries.push(entry)
    return entry
  }

  dropEntry (id: string) {
    const newEntries = this._entries.filter(entry => entry.id !== id)
    if (newEntries.length === this._entries.length) return false
    this._entries.splice(0, this._entries.length, ...newEntries)
    return true
  }

  get entries () {
    return this._entries
  }

  get value () {
    const returned: SheetBaseCollectionValue = []
    for (const entryPos in this._entries) Object.defineProperty(returned, entryPos, { get: () => this._entries[entryPos].value })
    return returned
  }

  strictEntry (id: string) {
    return this._entries.find(entry => (entry.id === id))
  }

  entry (id: string) {
    const found = this.strictEntry(id)
    return found ?? new SheetBaseEntry({ id: '', parentCollection: this })
  }
}

export type { SheetBaseCollectionDescriptor, SheetBaseCollectionValue }
export default SheetBaseCollection
