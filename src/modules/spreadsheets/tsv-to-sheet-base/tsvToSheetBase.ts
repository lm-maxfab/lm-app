import SheetBase from './SheetBase'
import tsvToEncodedTsv from './tsvToEncodedTsv'
import tsvTo2DArray from './tsvTo2DArray'
import encodedTsvArrayToTsvArray from './encodedTsvArrayToTsvArray'

function tsvToSheetBase (tsv: string): SheetBase {
  const encodedTsv = tsvToEncodedTsv(tsv)
  const encodedTsvArray = tsvTo2DArray(encodedTsv)
  const decodedTsvArray = encodedTsvArrayToTsvArray(encodedTsvArray)
  console.log(decodedTsvArray)
  // const unescapedArrayTsvBase = arrayTsvBase.map(line => line.map(cell => encodedTsvToTsv(cell)))
  // console.log(tsvArray)
  return {}
}

export default tsvToSheetBase
