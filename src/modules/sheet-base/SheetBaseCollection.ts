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
  #name: string
  #description: string
  #parentBase: SheetBase
  #entries: SheetBaseEntry[] = []

  constructor ({ name, description, parentBase }: SheetBaseCollectionDescriptor) {
    this.#name = name
    this.#description = description ?? ''
    this.#parentBase = parentBase ?? new SheetBase()
  }

  get name () { return this.#name }
  get description () { return this.#description }
  get parentBase () { return this.#parentBase }

  createEntry (descriptor: SheetBaseEntryDescriptor) {
    const entry = new SheetBaseEntry({ ...descriptor, parentCollection: this })
    const alreadyExistingEntry = this.strictEntry(entry.id)
    if (alreadyExistingEntry !== undefined) {
      console.warn(`entry '${entry.id}' already exists and is gonna be overwridden`)
      this.dropEntry(entry.id)
    }
    this.#entries.push(entry)
    return entry
  }

  dropEntry (id: string) {
    const newEntries = this.#entries.filter(entry => entry.id !== id)
    if (newEntries.length === this.#entries.length) return false
    this.#entries.splice(0, this.#entries.length, ...newEntries)
    return true
  }

  get entries () {
    return this.#entries
  }

  get value () {
    const returned: SheetBaseCollectionValue = []
    for (const entryPos in this.#entries) Object.defineProperty(returned, entryPos, { get: () => this.#entries[entryPos].value })
    return returned
  }

  strictEntry (id: string) {
    return this.#entries.find(entry => (entry.id === id))
  }

  entry (id: string) {
    const found = this.strictEntry(id)
    return found ?? new SheetBaseEntry({ id: '', parentCollection: this })
  }
}

export type { SheetBaseCollectionDescriptor, SheetBaseCollectionValue }
export default SheetBaseCollection
