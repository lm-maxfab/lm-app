import fetchTsv from './fetchTsv'
import tsvToSheetBase from './tsvToSheetBase'

async function yoDawg (): Promise<void> {
  const tsvBase = await fetchTsv('https://assets-decodeurs.lemonde.fr/sheets/qO7G0Yk6QnNQppeLY7BOVlnbnLyXxg_729')
  const sheetBase = tsvToSheetBase(tsvBase)
  // console.log(sheetBase)
}

export default yoDawg
