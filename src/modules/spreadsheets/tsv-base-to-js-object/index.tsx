function tsvToEscapedTsv (tsv: string): string {
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
    const encInside = window.btoa(inside)
    return tsvComplexCellOpeningTag + encInside + tsvComplexCellClosingTag
  }
  returned = returned.replace(tsvComplexCellRegex, tsvComplexNonencCellEncoder)
  return returned
}

function tsvTo2DObject (tsv: string): string[][] {
  return tsv
    .split('\n')
    .map((line: string) => line.split('\t'))
}

function unescapeTsvObject (tsvObject: string[][]): string[][] {
  return [['lol']]
}

function tsvBaseToJsObject (tsvBase: string) {
  // Replace "complex cells" content with btoa(content)
  // in order to avoid splitting on newlines inside cells

  const tsvBaseWithEncCells = tsvToEscapedTsv(tsvBase)
  const tsvObject = tsvTo2DObject(tsvBaseWithEncCells)
  const unescapedTsvObject = unescapeTsvObject(tsvObject)
  console.log(tsvObject)


  return [1, 2, 4]
}

export default tsvBaseToJsObject