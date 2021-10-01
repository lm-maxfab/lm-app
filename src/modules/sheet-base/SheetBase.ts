import SheetBaseCollection, { SheetBaseCollectionDescriptor, SheetBaseCollectionValue } from './SheetBaseCollection'

interface SheetBaseValue {
  readonly [key: string]: SheetBaseCollectionValue
}

class SheetBase {
  #collections: SheetBaseCollection[] = []
  
  createCollection (descriptor: SheetBaseCollectionDescriptor) {
    const collection = new SheetBaseCollection({ ...descriptor, parentBase: this })
    const alreadyExistingCollection = this.collection(collection.name)
    if (alreadyExistingCollection !== undefined) {
      console.warn(`collection ${collection.name} already exists and is gonna be overwridden`)
      this.dropCollection(collection.name)
    }
    this.#collections.push(collection)
    return collection
  }

  dropCollection (name: string) {
    const newCollections = this.#collections.filter(collection => collection.name !== name)
    if (newCollections.length === this.#collections.length) return false
    this.#collections.splice(0, this.#collections.length, ...newCollections)
    return true
  }

  get collections () {
    return this.#collections
  }

  get value () {
    const returned: SheetBaseValue = {}
    for (const col of this.#collections) Object.defineProperty(returned, col.name, { get: () => col.value })
    return returned
  }

  collection (name: string) {
    return this.#collections.find(collection => (collection.name === name))
  }
}

export type { SheetBaseValue }
export default SheetBase
