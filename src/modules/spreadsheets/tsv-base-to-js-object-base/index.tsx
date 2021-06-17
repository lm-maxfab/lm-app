/* * * * * * * * * * * * * * *
 * TSV TO ENCODED TSV
 * * * * * * * * * * * * * * */
function tsvToEncodedTsv (tsv: string): string {
  let returned = tsv
  const tsvComplexCellOpeningRegex = new RegExp(`(\t|\n)"`, 'gm')
  const tsvComplexCellOpeningTag = '<<<CELL>>>'
  const tsvComplexCellOpeningTransform = (match: string): string => `${match[0]}${tsvComplexCellOpeningTag}`
  const tsvComplexCellClosingRegex = new RegExp(`"(\t|\n)`, 'gm')
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
 * TSV TO 2D OBJECT
 * * * * * * * * * * * * * * */
function tsvTo2DArray (tsv: string): string[][] {
  return tsv
    .split('\n')
    .map(line => line.split('\t'))
}

/* * * * * * * * * * * * * * *
 * GET COLLECTIONS META
 * * * * * * * * * * * * * * */
interface CollectionsMeta {
  tut: 2
}

function getCollectionsMeta (arrayTsvBase: any): CollectionsMeta {
  const head = arrayTsvBase[0]
  const body = arrayTsvBase.slice(1)
  const keyColPos = head.findIndex((cell: string) => cell === 'key')
  const labelColPos = head.findIndex((cell: string) => cell === 'label')
  const typeColPos = head.findIndex((cell: string) => cell === 'type')
  if (keyColPos === -1
    || labelColPos === -1
    || typeColPos === -1) throw new Error('TSV base heads should contain at least a key, a label and a type field.')
  let currentCollection: string|null = null
  let currentCollectionName: string|null = null
  const cleverCells = body.map((lineData: string[], linePos: number) => {
    const key = lineData[keyColPos]
    const label = lineData[labelColPos]
    const type = lineData[typeColPos]
    if (type === 'id') {
      currentCollection = key
      currentCollectionName = label
    }
    return lineData.map((cellData: string, colPos: number) => ({
      key,
      label,
      type,
      collection: currentCollection,
      collectionName: currentCollectionName,
      rawData: cellData,
      col: colPos,
      line: linePos
    }))
  })

  
  console.log(cleverCells)
  
  
  return { tut: 2 }
}

function tsvBaseToJsObjectsBase (tsvBase: string): number[] {
  const tsvBaseWithEncCells = tsvToEncodedTsv(tsvBase)
  const arrayTsvBase = tsvTo2DArray(tsvBaseWithEncCells)
  const unescapedArrayTsvBase = arrayTsvBase.map(line => line.map(cell => encodedTsvToTsv(cell)))
  const collectionsMeta = getCollectionsMeta(unescapedArrayTsvBase)
  console.log(collectionsMeta)

  return [1, 2, 4]
}

export default tsvBaseToJsObjectsBase