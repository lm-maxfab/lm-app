import { SheetBase, tsvToSheetBase } from '../sheet-base'

async function fetchSheetBase (url: string): Promise<SheetBase|undefined> {
  try {
    const res = await window.fetch(url)
    if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`)
    const tsv = await res.text()
    const sheetBase = tsvToSheetBase(tsv)
    return sheetBase
  } catch (error) {
    console.warn(error)
    return undefined
  }
}

export default fetchSheetBase
