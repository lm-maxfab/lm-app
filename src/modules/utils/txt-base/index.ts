import transform from './transformers'

export class Base {
  collections: Collection[]
  parent: this
  constructor () {
    this.collections = []
    this.parent = this
    this.get = this.get.bind(this)
    this.create = this.create.bind(this)
    this.delete = this.delete.bind(this)
    this.resolver = this.resolver.bind(this)
  }

  get (name: Collection['name']) {
    return this.collections.find(col => col.name === name)
  }

  create (name: Collection['name']) {
    const alreadyExists = this.get(name)
    if (alreadyExists !== undefined) return alreadyExists
    const newCollection = new Collection(name, this)
    this.collections.push(newCollection)
    return newCollection
  }

  delete (name: Collection['name']) {
    const collection = this.get(name)
    if (collection === undefined) return
    const collectionIndex = this.collections.indexOf(collection)
    if (collectionIndex === -1) return
    this.collections = [
      ...this.collections.slice(0, collectionIndex),
      ...this.collections.slice(collectionIndex + 1)
    ]
    return true
  }

  resolver (root: Field|Entry|Collection|Base, path: string) {
    const [firstChunk, ...lastChunks] = path.split('/')    
    let currentItem: Field|Entry|Collection|Base|undefined = undefined
    if (firstChunk === '..') currentItem = root.parent
    else if (firstChunk === '.') currentItem = root
    else currentItem = this
    lastChunks.forEach(chunk => {
      if (currentItem === undefined) return
      if (chunk === '..') currentItem = currentItem.parent
      else {
        if (currentItem instanceof Field) { currentItem = undefined }
        else { currentItem = currentItem.get(chunk) }
      }
    })
    return currentItem
  }

  get value () {
    const returned: { [key: string]: Collection['value'] } = {}
    this.collections.forEach(collection => {
      Object.defineProperty(
        returned,
        collection.name,
        { get: () => collection.value }
      )
    })
    return returned
  }
}

export class Collection {
  static nameRegexp = /[a-zA-Z0-9\-\_]+/
  name: string
  parent: Base
  entries: Entry[]
  constructor (name: Collection['name'], parent: Base) {
    this.name = name
    this.parent = parent
    this.entries = []
    this.get = this.get.bind(this)
    this.create = this.create.bind(this)
    this.delete = this.delete.bind(this)
    this.resolver = this.resolver.bind(this)
  }

  get (name: Entry['name']) {
    return this.entries.find(entry => entry.name === name)
  }

  create (name: Entry['name']) {
    const alreadyExists = this.get(name)
    if (alreadyExists !== undefined) return alreadyExists
    const newEntry = new Entry(name, this)
    this.entries.push(newEntry)
    return newEntry
  }
  
  delete (name: Entry['name']) {
    const entry = this.get(name)
    if (entry === undefined) return
    const entryIndex = this.entries.indexOf(entry)
    if (entryIndex === -1) return
    this.entries = [
      ...this.entries.slice(0, entryIndex),
      ...this.entries.slice(entryIndex + 1)
    ]
    return true
  }

  resolver (...args: Parameters<Base['resolver']>) {
    return this.parent.resolver(...args)
  }

  get value () {
    const returned: { [key: string]: Entry['value'] } = {}
    this.entries.forEach(entry => {
      Object.defineProperty(
        returned,
        entry.name,
        { get: () => entry.value }
      )
    })
    return returned
  }
}

export class Entry {
  static nameRegexp = /[a-zA-Z0-9\-\_]+/
  name: string
  parent: Collection
  fields: Field[]
  constructor (name: Entry['name'], parent: Collection) {
    this.name = name
    this.parent = parent
    this.fields = []
    this.get = this.get.bind(this)
    this.create = this.create.bind(this)
    this.delete = this.delete.bind(this)
    this.resolver = this.resolver.bind(this)
  }

  get (name: Field['name']) {
    return this.fields.find(field => field.name === name)
  }

  create (name: Field['name'], rawValue: Field['rawValue'], type?: Field['type']) {
    const alreadyExists = this.get(name)
    if (alreadyExists !== undefined) return alreadyExists
    const newField = new Field(name, this, rawValue, type)
    this.fields.push(newField)
    return newField
  }
  
  delete (name: Field['name']) {
    const field = this.get(name)
    if (field === undefined) return
    const fieldIndex = this.fields.indexOf(field)
    if (fieldIndex === -1) return
    this.fields = [
      ...this.fields.slice(0, fieldIndex),
      ...this.fields.slice(fieldIndex + 1)
    ]
    return true
  }

  resolver (...args: Parameters<Base['resolver']>) {
    return this.parent.resolver(...args)
  }

  get value () {
    const returned: { [key: string]: Field['value'] } = {}
    this.fields.forEach(field => {
      Object.defineProperty(
        returned,
        field.name,
        { get: () => field.value }
      )
    })
    return returned
  }
}

export class Field {
  static nameRegexp = /[a-zA-Z0-9\-\_]+/
  static allowedTypes = ['string', 'string+', 'number', 'number+', 'boolean', 'boolean+', 'null', 'null+', 'ref', 'ref+'] as const
  static typeRegexp = /(string)|(string\+)|(number)|(number\+)|(boolean)|(boolean\+)|(null)|(null\+)|(ref)|(ref\+)/
  name: string
  parent: Entry
  rawValue: string
  type?: typeof Field.allowedTypes[number]
  constructor (
    name: Field['name'],
    parent: Entry,
    rawValue: Field['rawValue'],
    type?: Field['type']) {
    this.name = name
    this.parent = parent
    this.rawValue = rawValue
    this.type = type
    this.updateRaw = this.updateRaw.bind(this)
    // this.asString = this.asString.bind(this)
    // this.asNumber = this.asNumber.bind(this)
    // this.asBoolean = this.asBoolean.bind(this)
    // this.asNull = this.asNull.bind(this)
    // this.asRef = this.asRef.bind(this)
    // this.as = this.as.bind(this)
    // this.guessType = this.guessType.bind(this)
    this.resolver = this.resolver.bind(this)
    this.resolve = this.resolve.bind(this)
  }

  updateRaw = (updater: (currValue: string) => string) => {
    const newRawValue = updater(this.rawValue)
    this.rawValue = newRawValue
  }

  get transformedValue () {
    const raw = this.rawValue
    const [initialValue, ...transformersDescriptors] = raw
      .split('>>>')
      .map(chunk => chunk.trim())
    const transformed = transformersDescriptors.reduce(transform, initialValue)
    // [WIP] convert Base, Collection, etc... to their values ?
    return transformed
  }

  // asString () {
  //   return this.rawValue
  // }

  // asNumber () {
  //   return parseFloat(this.rawValue)
  // }

  // asBoolean () {
  //   if (this.rawValue.match(/^true$/igm)) return true
  //   return false
  // }

  // asNull () {
  //   return null
  // }

  // // [WIP] should not return any
  // asRef (): any {
  //   return this.resolve(this.rawValue)
  // }

  // // [WIP] should not return any
  // as (type: NonNullable<Field['type']>): any {
  //   if (type === 'string') return this.asString()
  //   else if (type === 'number') return this.asNumber()
  //   else if (type === 'boolean') return this.asBoolean()
  //   else if (type === 'ref') return this.asRef()
  //   return this.asNull()
  // }

  // guessType (): NonNullable<Field['type']> {
  //   if (this.rawValue.match(/^\s*$/)) return 'string'
  //   if (this.resolve(this.rawValue) !== undefined) return 'ref'
  //   else if (this.rawValue.match(/^[0-9]*(\.)?[0-9]+$/)) return 'number'
  //   else if (this.rawValue.match(/^true$/igm)) return 'boolean'
  //   else if (this.rawValue.match(/^false$/igm)) return 'boolean'
  //   else if (this.rawValue.match(/^null$/igm)) return 'null'
  //   return 'string'
  // }

  resolver (...args: Parameters<Base['resolver']>) {
    return this.parent.resolver(...args)
  }

  resolve (path: string) {
    return this.resolver(this, path)
  }

  get value () {
    return this.transformedValue
    // if (this.type !== undefined) return this.as(this.type)
    // const guessedType = this.guessType()
    // return this.as(guessedType)
  }
}

function parse (str: string) {
  const base = new Base()
  let currentCollection: Collection|null = null
  let currentEntry: Entry|null = null
  let currentField: Field|null = null

  const lines = str.split('\n')

  const newCollectionRegexp = new RegExp('^\\s*#\\s*' + Collection.nameRegexp.source)
  const newEntryRegexp = new RegExp('^\\s*##\\s*' + Entry.nameRegexp.source)
  const newFieldRegexp = new RegExp('^\\s*_\\s*' + Field.nameRegexp.source + '(\\s*:\\s*(' + Field.typeRegexp.source + '))?\\s*:')
  const newCommentRegexp = /^\s*\/\//

  lines.forEach(line => {
    line = line.replace(/^\s*/, '')
    const isComment = newCommentRegexp.test(line)
    if (isComment) return
    if (newCollectionRegexp.test(line)) {
      const newCollectionLineMatch = line.match(newCollectionRegexp)?.[0]
      if (newCollectionLineMatch !== undefined) addCollection(newCollectionLineMatch)
    } else if (newEntryRegexp.test(line)) {
      const newEntryLineMatch = line.match(newEntryRegexp)?.[0]
      if (newEntryLineMatch !== undefined) addEntry(newEntryLineMatch)
    } else if (newFieldRegexp.test(line)) {
      const newFieldLineMatch = line.match(newFieldRegexp)?.[0]
      if (newFieldLineMatch !== undefined) {
        addField(newFieldLineMatch)
        const content = line.replace(newFieldLineMatch, '')
        addContent(content)
      }
    } else {
      addContent(line)
    }
  })

  return base

  /* Hoisted helper functions */

  function addCollection (matched: string) {
    const collectionName = matched.trim().replace(/^#\s*/, '')
    currentCollection = base.create(collectionName.trim())
  }

  function addEntry (matched: string) {
    // [WIP] silent log here
    if (currentCollection === null) return console.warn('Cannot create entry since there is no current collection')
    const entryName = matched.trim().replace(/^##\s*/, '')
    currentEntry = currentCollection.create(entryName.trim())
  }

  function addField (matched: string) {
    if (currentEntry === null) return console.warn('Cannot create field since there is no current entry')
    const fieldNameWithType = matched
      .trim()
      .replace(/^_/, '')
      .replace(/:$/, '')
    const fieldType = fieldNameWithType
      .match(/:[a-z]+$/)?.[0]
      .replace(/^:/, '')
    const fieldName = fieldType === undefined
      ? fieldNameWithType
      : fieldNameWithType.replace(/:[a-z]+$/, '')
    const fieldTypeValidator = (str?: string): str is Field['type'] => {
      if (str === undefined) return true
      if ((Field.allowedTypes as unknown as string[]).includes(str)) return true
      return false
    }
    const isFieldTypeValid = fieldTypeValidator(fieldType)
    currentField = currentEntry.create(
      fieldName.trim(),
      '',
      isFieldTypeValid ? fieldType : undefined
    )
  }

  function addContent (content: string) {
    if (currentField === null) return console.warn('Cannot create content since there is no current field')
    currentField.updateRaw(curr => `${curr}${content.trim()}`)
  }
}

console.log(Field.typeRegexp)

export default parse
