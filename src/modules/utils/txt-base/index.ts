import fs from 'node:fs'
import path from 'node:path'

export class Field {
  name: string
  rawValue: string
  type?: 'string'|'number'|'boolean'|'null'
  constructor (
    name: Field['name'],
    rawValue: Field['rawValue'],
    type?: Field['type']) {
    this.name = name
    this.rawValue = rawValue
    this.type = type
    this.rawUpdate = this.rawUpdate.bind(this)
    this.asString = this.asString.bind(this)
    this.asNumber = this.asNumber.bind(this)
    this.asBoolean = this.asBoolean.bind(this)
    this.asNull = this.asNull.bind(this)
    this.as = this.as.bind(this)
    this.guessType = this.guessType.bind(this)
  }

  rawUpdate = (rawUpdater: (currValue: string) => string) => {
    const newRawValue = rawUpdater(this.rawValue)
    this.rawValue = newRawValue
  }

  asString () {
    return this.rawValue
  }

  asNumber () {
    return parseFloat(this.rawValue)
  }

  asBoolean () {
    if (this.rawValue.match(/^true$/igm)) return true
    return false
  }

  asNull () {
    return null
  }

  as (type: NonNullable<Field['type']>) {
    if (type === 'string') return this.asString()
    else if (type === 'number') return this.asNumber()
    else if (type === 'boolean') return this.asBoolean()
    return this.asNull()
  }

  guessType (): NonNullable<Field['type']> {
    if (this.rawValue.match(/^[0-9]*(\.)?[0-9]+$/)) return 'number'
    else if (this.rawValue.match(/^true$/igm)) return 'boolean'
    else if (this.rawValue.match(/^false$/igm)) return 'boolean'
    else if (this.rawValue.match(/^null$/igm)) return 'null'
    return 'string'
  }

  get value () {
    if (this.type !== undefined) return this.as(this.type)
    const guessedType = this.guessType()
    return this.as(guessedType)
  }
}

export class Entry {
  name: string
  fields: Field[]
  constructor (name: Entry['name']) {
    this.name = name
    this.fields = []
    this.getField = this.getField.bind(this)
    this.createField = this.createField.bind(this)
    this.deleteField = this.deleteField.bind(this)
  }

  getField (name: Field['name']) {
    return this.fields.find(field => field.name === name)
  }

  createField (name: Field['name'], rawValue: Field['rawValue'], type?: Field['type']) {
    const alreadyExists = this.getField(name)
    if (alreadyExists !== undefined) return alreadyExists
    const newField = new Field(name, rawValue, type)
    this.fields.push(newField)
    return newField
  }
  
  deleteField (name: Field['name']) {
    const field = this.getField(name)
    if (field === undefined) return
    const fieldIndex = this.fields.indexOf(field)
    if (fieldIndex === -1) return
    this.fields = [
      ...this.fields.slice(0, fieldIndex),
      ...this.fields.slice(fieldIndex + 1)
    ]
    return true
  }

  get value () {
    const returned: { [key: string]: Field['value'] } = {}
    this.fields.forEach(field => {
      returned[field.name] = field.value
    })
    return returned
  }
}

export class Collection {
  name: string
  entries: Entry[]
  constructor (name: Collection['name']) {
    this.name = name
    this.entries = []
    this.getEntry = this.getEntry.bind(this)
    this.createEntry = this.createEntry.bind(this)
    this.deleteEntry = this.deleteEntry.bind(this)
  }

  getEntry (name: Entry['name']) {
    return this.entries.find(entry => entry.name === name)
  }

  createEntry (name: Entry['name']) {
    const alreadyExists = this.getEntry(name)
    if (alreadyExists !== undefined) return alreadyExists
    const newEntry = new Entry(name)
    this.entries.push(newEntry)
    return newEntry
  }
  
  deleteEntry (name: Entry['name']) {
    const entry = this.getEntry(name)
    if (entry === undefined) return
    const entryIndex = this.entries.indexOf(entry)
    if (entryIndex === -1) return
    this.entries = [
      ...this.entries.slice(0, entryIndex),
      ...this.entries.slice(entryIndex + 1)
    ]
    return true
  }

  get value () {
    const returned: { [key: string]: Entry['value'] } = {}
    this.entries.forEach(entry => {
      returned[entry.name] = entry.value
    })
    return returned
  }
}

export class Base {
  collections: Collection[]
  constructor () {
    this.collections = []
    this.getCollection = this.getCollection.bind(this)
    this.createCollection = this.createCollection.bind(this)
    this.deleteCollection = this.deleteCollection.bind(this)
  }

  getCollection (name: Collection['name']) {
    return this.collections.find(col => col.name === name)
  }

  createCollection (name: Collection['name']) {
    const alreadyExists = this.getCollection(name)
    if (alreadyExists !== undefined) return alreadyExists
    const newCollection = new Collection(name)
    this.collections.push(newCollection)
    return newCollection
  }

  deleteCollection (name: Collection['name']) {
    const collection = this.getCollection(name)
    if (collection === undefined) return
    const collectionIndex = this.collections.indexOf(collection)
    if (collectionIndex === -1) return
    this.collections = [
      ...this.collections.slice(0, collectionIndex),
      ...this.collections.slice(collectionIndex + 1)
    ]
    return true
  }

  get value () {
    const returned: { [key: string]: Collection['value'] } = {}
    this.collections.forEach(collection => {
      returned[collection.name] = collection.value
    })
    return returned
  }
}

function parse (str: string) {
  const base = new Base()
  let currentCollection: Collection|null = null
  let currentEntry: Entry|null = null
  let currentField: Field|null = null

  const lines = str.split('\n')

  const newCollectionRegexp = /^\s*#\s*[a-zA-Z0-9\-\_]+/
  const newEntryRegexp = /^\s*##\s*[a-zA-Z0-9\-\_]+/
  const newFieldRegexp = /^\s*_[a-zA-Z0-9]+(:[a-z]+)?:/
  const commentRegexp = /^\s*\/\//
  lines.forEach(line => {
    line = line.replace(/^\s*/, '')
    const isComment = commentRegexp.test(line)
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

  function addCollection (matched: string) {
    const collectionName = matched.trim().replace(/^#\s*/, '')
    currentCollection = base.createCollection(collectionName.trim())
  }

  function addEntry (matched: string) {
    if (currentCollection === null) return console.warn('Cannot create entry since there is no current collection')
    const entryName = matched.trim().replace(/^##\s*/, '')
    currentEntry = currentCollection.createEntry(entryName.trim())
  }

  function addField (matched: string) {
    if (currentEntry === null) return console.warn('Cannot create field since there is no current entry')
    const fieldNameWithType = matched.trim().replace(/^_/, '').replace(/:$/, '')
    const fieldType = fieldNameWithType.match(/:[a-z]+$/)?.[0].replace(/^:/, '')
    const fieldName = fieldType === undefined
      ? fieldNameWithType
      : fieldNameWithType.replace(/:[a-z]+$/, '')
    const fieldTypeValidator = (str?: string): str is Field['type'] => {
      if (str === undefined) return true
      if (['string', 'number', 'boolean', 'null'].includes(str)) return true
      return false
    }
    const isFieldTypeValid = fieldTypeValidator(fieldType)
    currentField = currentEntry.createField(
      fieldName.trim(),
      '',
      isFieldTypeValid ? fieldType : undefined
    )
  }

  function addContent (content: string) {
    if (currentField === null) return console.warn('Cannot create content since there is no current field')
    currentField.rawUpdate(curr => `${curr}${content.trim()}`)
  }
}

export default parse
