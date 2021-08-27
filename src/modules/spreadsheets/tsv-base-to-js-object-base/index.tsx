import StrToHtml from '../../text/StrToHtml'

/* * * * * * * * * * * * * * *
 * SHEET BASE OBJECTS
 * * * * * * * * * * * * * * */
interface FieldProps {
  raw?: string
  key?: string
  name?: string
  type?: string
  line?: number
  entry?: Entry
}

class Field implements FieldProps {
  raw: string
  key: string
  name: string
  type: string
  line: number
  entry: Entry

  constructor (props: FieldProps) {
    this.raw = props.raw ?? ''
    this.key = props.key ?? ''
    this.name = props.name ?? ''
    this.type = props.type ?? 'text'
    this.line = props.line ?? 0
    this.entry = props.entry ?? new Entry({})
  }

  get value (): any {
    /* * * * * * * * * * * * * *
     * PRIMITIVES
     * * * * * * * * * * * * * */
    // String / Text
    if (this.type === 'string' || this.type === 'text') {
      return this.raw
    }
    // Number
    if (this.type === 'number') {
      const replacedCommas = this.raw.replace(/,/gm, '.')
      return window.parseFloat(replacedCommas)
    }
    // BigInt
    if (this.type === 'bigint') {
      return BigInt(this.raw)
    }
    // Boolean
    if (this.type === 'boolean') {
      const isTrue = this.raw.toLowerCase() === '1' || this.raw.toLowerCase() === 'true'
      return isTrue
    }
    // Null
    if (this.type === 'null') {
      return null
    }
    // Undefined
    if (this.type === 'undefined') {
      return undefined
    }

    /* * * * * * * * * * * * * *
     * COMPLEX
     * * * * * * * * * * * * * */
    // HTML
    if (this.type === 'html') {
      return <StrToHtml content={this.raw} />
    }

    return this.raw
  }

  valueOf (): any {
    return this.value
  }
}

interface EntryProps {
  id?: string
  collection?: Collection
  fields?: Field[]
  column?: number
}

interface EntryValue {
  [key: string]: any
}

class Entry implements EntryProps {
  id: string
  collection: Collection
  column: number
  private _fields: Field[]
  get fields (): Field[] { return this._fields }

  constructor (props: EntryProps) {
    this.id = props.id ?? ''
    this.collection = props.collection ?? new Collection({})
    this.column = props.column ?? 0
    this._fields = props.fields ?? []
  }

  get value (): EntryValue {
    const returned: EntryValue = {}
    this.fields.forEach(field => {
      returned[field.key] = field.value
    })
    return returned
  }

  valueOf (): EntryValue { return this.value }

  findFieldByKey (key: string): Field|undefined {
    const found = this.fields.find(field => field.key === key)
    return found
  }

  createField (props: FieldProps): Field {
    const key = props.key ?? ''
    const name = props.name ?? ''
    const type = props.type ?? ''
    const line = props.line ?? 0
    const raw = props.raw ?? ''
    const fieldAlreadyExists = this.findFieldByKey(key) !== undefined
    const newField = new Field({ key, name, type, line, raw, entry: this })
    if (fieldAlreadyExists) this.deleteField(key)
    this.fields.push(newField)
    return newField
  }

  deleteField (key: string): undefined {
    const fieldIndex = this.fields.findIndex(field => field.key === key)
    if (fieldIndex === -1) return
    this._fields = [
      ...this._fields.slice(0, fieldIndex),
      ...this._fields.slice(fieldIndex + 1)
    ]
  }
}

interface CollectionProps {
  id?: string
  name?: string
  keys?: string[]
  entries?: Entry[]
  base?: SheetBase
}

type CollectionValue = EntryValue[]

class Collection implements CollectionProps {
  id: string
  name: string
  base: SheetBase
  private readonly _keys: string[]
  private _entries: Entry[]
  get keys (): string[] { return this._keys }
  get entries (): Entry[] { return this._entries }

  constructor (props: CollectionProps) {
    this._keys = props.keys ?? []
    this._entries = props.entries ?? []
    this.id = props.id ?? ''
    this.name = props.name ?? ''
    this.base = props.base ?? new SheetBase()
  }

  get value (): CollectionValue {
    const returned: CollectionValue = []
    this.entries.forEach(entry => {
      returned.push(entry.value)
    })
    return returned
  }

  valueOf (): CollectionValue { return this.value }

  rename (name: string): Collection {
    this.name = name
    return this
  }

  findEntryById (id: string): Entry|undefined {
    const found = this.entries.find(entry => entry.id === id)
    return found
  }

  findEntryByColumn (column: number): Entry|undefined {
    const found = this.entries.find(entry => entry.column === column)
    return found
  }

  createEntry (id: string, column: number): Entry {
    const idAlreadyExists = this.findEntryById(id) !== undefined
    const newEntry = new Entry({ id, column })
    if (idAlreadyExists) this.deleteEntry(id)
    this.entries.push(newEntry)
    return newEntry
  }

  deleteEntry (id: string): undefined {
    const entryIndex = this.entries.findIndex(entry => entry.id === id)
    if (entryIndex === -1) return
    this._entries = [
      ...this._entries.slice(0, entryIndex),
      ...this._entries.slice(entryIndex + 1)
    ]
  }
}

interface SheetBaseValue {
  [collectionName: string]: CollectionValue
}

class SheetBase extends Array implements Array<Collection> {
  private readonly _collections: Collection[] = []
  get collections (): Collection[] { return this._collections }

  get value (): SheetBaseValue {
    const returned: SheetBaseValue = {}
    this.collections.forEach(collection => {
      returned[collection.id] = collection.value
    })
    return returned
  }

  findCollectionById (id: string): Collection|undefined {
    const found = this.collections.find(col => col.id === id)
    return found
  }

  createCollection (id: string, name: string): Collection {
    const collection = this.findCollectionById(id)
    if (collection === undefined) {
      const newCollection = new Collection({ id, name })
      this.collections.push(newCollection)
      return newCollection
    } else {
      collection.rename(name)
      return collection
    }
  }
}

/* * * * * * * * * * * * * * *
 * TSV TO ENCODED TSV
 * * * * * * * * * * * * * * */
function tsvToEncodedTsv (tsv: string): string {
  let returned = tsv
  const tsvComplexCellOpeningRegex = /(\t|\n)"/gm // RegExp(`(\t|\n)"`, 'gm')
  const tsvComplexCellOpeningTag = '<<<CELL>>>'
  const tsvComplexCellOpeningTransform = (match: string): string => `${match[0]}${tsvComplexCellOpeningTag}`
  const tsvComplexCellClosingRegex = /"(\t|\n)/gm // new RegExp(`"(\t|\n)`, 'gm')
  const tsvComplexCellClosingTag = '<<</CELL>>>'
  const tsvComplexCellClosingTransform = (match: string): string => `${tsvComplexCellClosingTag}${match[match.length - 1]}`
  returned = returned.replace(tsvComplexCellOpeningRegex, tsvComplexCellOpeningTransform)
  returned = returned.replace(tsvComplexCellClosingRegex, tsvComplexCellClosingTransform)
  const tsvComplexCellClosingTagEscaped = tsvComplexCellClosingTag.replace(/\//gm, '\\/')
  const tsvComplexCellRegex = new RegExp(`${tsvComplexCellOpeningTag}[\\S\\s]*?${tsvComplexCellClosingTagEscaped}`, 'gm')
  const tsvComplexNonencCellEncoder = (match: string): string => {
    const inside = match
      .replace(tsvComplexCellOpeningTag, '')
      .replace(tsvComplexCellClosingTag, '')
      .replace(/("")+/gm, (match: string): string => {
        const length: number = Math.floor(match.length / 2)
        const returned: string = new Array(length).fill('"').join('')
        return returned
      })
    const { btoa, unescape, encodeURIComponent: encode } = window
    const encInside = btoa(unescape(encode(inside)))
    return tsvComplexCellOpeningTag + encInside + tsvComplexCellClosingTag
  }
  returned = returned.replace(tsvComplexCellRegex, tsvComplexNonencCellEncoder)
  return returned
}

/* * * * * * * * * * * * * * *
 * ENCODED TSV TO TSV
 * * * * * * * * * * * * * * */
function encodedTsvToTsv (encodedTsv: string): string {
  let returned = encodedTsv
  const tsvComplexCellOpeningTag = '<<<CELL>>>'
  const tsvComplexCellClosingTag = '<<</CELL>>>'
  const tsvComplexCellClosingTagEscaped = tsvComplexCellClosingTag.replace(/\//gm, '\\/')
  const tsvComplexCellRegex = new RegExp(`${tsvComplexCellOpeningTag}[\\S\\s]*?${tsvComplexCellClosingTagEscaped}`, 'gm')
  const tsvComplexCellDecoder = (match: string): string => {
    const inside = match
      .replace(tsvComplexCellOpeningTag, '')
      .replace(tsvComplexCellClosingTag, '')
    const { atob, escape, decodeURIComponent: decode } = window
    const decInside = decode(escape(atob(inside)))
    return decInside
  }
  returned = returned.replace(tsvComplexCellRegex, tsvComplexCellDecoder)
  return returned
}

/* * * * * * * * * * * * * * *
 * TSV TO ARRAY TSV
 * * * * * * * * * * * * * * */
function tsvToArrayTsv (tsv: string): string[][] {
  return tsv
    .split('\n')
    .map(line => line.split('\t'))
}

/* * * * * * * * * * * * * * *
 * ARRAY TSV BASE TO SHEET BASE
 * * * * * * * * * * * * * * */
function arrayTsvBaseToSheetBase (arrayTsvBase: any): SheetBase {
  // Separate document head and body
  const head = arrayTsvBase[0]
  const body = arrayTsvBase.slice(1)
  // Spot key, name and type column positions
  const keyColPos: number = head.findIndex((cell: string) => cell === 'key')
  const nameColPos: number = head.findIndex((cell: string) => cell === 'name')
  const typeColPos: number = head.findIndex((cell: string) => cell === 'type')
  if (keyColPos === -1
    || nameColPos === -1
    || typeColPos === -1) throw new Error('TSV base heads should contain at least a key, a name and a type field.')
  // If the columns are present, start reading each line of the document
  let currentCollectionId: string|null = null
  let currentCollectionName: string|null = null
  const sheetBase = new SheetBase()
  body.forEach((lineData: string[], linePos: number) => {
    const lineKey = lineData[keyColPos]
    const lineName = lineData[nameColPos]
    const lineType = lineData[typeColPos]
    // If the line has no key field, we can leave it alone
    if (lineKey === '') return
    // If the line is of id type, detect that we enter in a new collection
    if (lineType === 'id') {
      currentCollectionId = lineKey
      currentCollectionName = lineName
      sheetBase.createCollection(currentCollectionId, currentCollectionName)
    }
    // If we still didn't see a new collection line, then leave the line alone
    if (currentCollectionId === null) return
    // Else, grab the current collection in sheetBase
    const currentCollection = sheetBase.findCollectionById(currentCollectionId)
    if (currentCollection === undefined) return
    // For each cell of the line, create if needed the correct entry
    // then fill it with it's fields
    lineData.forEach((rawCell: string, colPos: number) => {
      if (colPos === keyColPos
        || colPos === nameColPos
        || colPos === typeColPos
        || lineKey === '') return
      if (lineType === 'id') {
        if (rawCell === '') return
        const currentEntry = currentCollection.createEntry(rawCell, colPos)
        if (currentEntry === undefined) return
        currentEntry.createField({
          key: 'id',
          name: lineName,
          type: lineType,
          line: linePos + 1,
          raw: rawCell
        })
      } else {
        const currentEntry = currentCollection.findEntryByColumn(colPos)
        if (currentEntry === undefined) return
        currentEntry.createField({
          key: lineKey,
          name: lineName,
          type: lineType,
          line: linePos + 1,
          raw: rawCell
        })
      }
    })
  })

  return sheetBase
}

/* * * * * * * * * * * * * * *
 * TSV BASE TO JS OBJECTS BASE
 * * * * * * * * * * * * * * */
function tsvBaseToJsObjectsBase (tsvBase: string): SheetBase {
  const tsvBaseWithEncCells = tsvToEncodedTsv(tsvBase)
  const arrayTsvBase = tsvToArrayTsv(tsvBaseWithEncCells)
  const unescapedArrayTsvBase = arrayTsvBase.map(line => line.map(cell => encodedTsvToTsv(cell)))
  const sheetBase = arrayTsvBaseToSheetBase(unescapedArrayTsvBase)
  return sheetBase
}

export default tsvBaseToJsObjectsBase

export {
  tsvToEncodedTsv,
  encodedTsvToTsv,
  tsvToArrayTsv,
  arrayTsvBaseToSheetBase,
  tsvBaseToJsObjectsBase,
  Field,
  Entry,
  Collection,
  SheetBase
}

export type {
  FieldProps,
  EntryProps,
  EntryValue,
  CollectionProps,
  CollectionValue,
  SheetBaseValue
}
