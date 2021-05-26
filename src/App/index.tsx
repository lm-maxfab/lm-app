import React, { Component } from 'react'

interface AppProps {}
interface AppState {}

class App extends Component<AppProps, AppState> {
  /* * * * * * * * * * * * * * *
   * DID MOUNT 
   * * * * * * * * * * * * * * */
  async componentDidMount () {
    try {
      // Fetch data
      const tsvBlob: Response = await window.fetch('https://assets-decodeurs.lemonde.fr/sheets/M76L8xg8JCyheXG-n84Lytui-i0ZMg_634?gqhzjzhazere=ef4aze')
      const rawTsv: string = await tsvBlob.text()
      
      // Replace "complex cells" content with btoa(content)
      // in order to avoid splitting on newlines inside cells
      let tsv: string = rawTsv
      const tsvComplexCellOpeningRegex: RegExp = new RegExp(`(\t|\n)"`, 'gm')
      const tsvComplexCellOpeningTag: string = '<<<CELL>>>'
      const tsvComplexCellOpeningTransform = (match: string): string => `${match[0]}${tsvComplexCellOpeningTag}`
      tsv = tsv.replace(tsvComplexCellOpeningRegex, tsvComplexCellOpeningTransform)
      const tsvComplexCellClosingRegex: RegExp = new RegExp(`"(\t|\n)`, 'gm')
      const tsvComplexCellClosingTag: string = '<<</CELL>>>'
      const tsvComplexCellClosingTransform = (match: string): string => `${tsvComplexCellClosingTag}${match[match.length - 1]}`
      tsv = tsv.replace(tsvComplexCellClosingRegex, tsvComplexCellClosingTransform)
      const tsvComplexCellClosingTagEscaped: string = tsvComplexCellClosingTag.replace(/\//gm, '\\/')
      const tsvComplexCellRegex: RegExp = new RegExp(`${tsvComplexCellOpeningTag}[\\S\\s]*?${tsvComplexCellClosingTagEscaped}`, 'gm')
      const tsvComplexNonencCellEncoder = (match: string): string => {
        const inside: string = match
          .replace(tsvComplexCellOpeningTag, '')
          .replace(tsvComplexCellClosingTag, '')
          .replace(/("")+/gm, (match: string): string => {
            const length: number = Math.floor(match.length / 2)
            const returned: string = new Array(length).fill('"').join('')
            return returned
          })
          const encInside: string = window.btoa(inside)
          return tsvComplexCellOpeningTag + encInside + tsvComplexCellClosingTag
      }
      tsv = tsv.replace(tsvComplexCellRegex, tsvComplexNonencCellEncoder)

      // Transform the TSV into a 2 dimentional array
      // where every line is the same length

      interface JsonSheetCell {
        column: number,
        line: number,
        value: string
      }

      const jsonSheetStrLines: string[] = tsv.split('\n')
      const jsonSheetRawCells: Array<string[]> = jsonSheetStrLines.map((line: string) => line.split('\t'))
      const jsonSheetTable: Array<JsonSheetCell[]> = jsonSheetRawCells
        .map((line: string[], linePos: number) => line
          .map((encCell: string, colPos: number) => {
            const isEnc: string[]|null = encCell.match(tsvComplexCellRegex)
            const noTagValue: string = encCell
              .replace(tsvComplexCellOpeningTag, '')
              .replace(tsvComplexCellClosingTag, '')
            const value = isEnc ? window.atob(noTagValue) : noTagValue
            return {
              column: colPos,
              line: linePos,
              value
            }
          })
        )
      
      const jsonSheetCells: JsonSheetCell[] = []
      jsonSheetTable.forEach((line: JsonSheetCell[]) => line.forEach((cell: JsonSheetCell) => jsonSheetCells.push(cell)))
      
      const preJsonSheetLines: Array<JsonSheetCell[]> = []
      jsonSheetCells.forEach(cell => {
        if (!preJsonSheetLines[cell.line]) preJsonSheetLines[cell.line] = []
        preJsonSheetLines[cell.line].push(cell)
      })

      const preJsonSheetColumns: Array<JsonSheetCell[]> = []
      jsonSheetCells.forEach(cell => {
        if (!preJsonSheetColumns[cell.column]) preJsonSheetColumns[cell.column] = []
        preJsonSheetColumns[cell.column].push(cell)
      })

      interface JsonSheetHead {
        keysCol: number|undefined,
        labelsCol: number|undefined,
        typesCol: number|undefined
      }

      const jsonSheetHead: JsonSheetHead = {
        keysCol: jsonSheetCells.find(cell => cell.line === 0 && cell.value === 'key')?.column,
        labelsCol: jsonSheetCells.find(cell => cell.line === 0 && cell.value === 'label')?.column,
        typesCol: jsonSheetCells.find(cell => cell.line === 0 && cell.value === 'type')?.column
      }

      const jsonSheetCellsHeadless = jsonSheetCells.filter(cell => cell.line === 0)

      interface JsonSheetLine {
        line: number,
        cells: JsonSheetCell[],
        type: 'empty' | 'first' | 'head' | 'property' | undefined
      }

      interface JsonSheetColumn {
        column: number,
        cells: JsonSheetCell[],
        type: 'empty' | 'head' | 'property' | undefined
      }

      class JsonSheetLiner {
        line: number
        cells: JsonSheetCell[]
        type: 'empty' | 'first' | 'head' | 'property' | undefined
        constructor (cells: JsonSheetCell[]) {
          const line = cells[0].line
          // WIP check if all cells are on the same line
          this.line = line
          this.cells = cells
          this.type = 'empty'
        }
      }

      const jsonSheetLines: JsonSheetLine[] = preJsonSheetLines.map((lineCells) => {
        const line = lineCells[0].line
        if (lineCells.some(cell => cell.line !== line)) {
          console.error('Malformed sheet line.')
          console.log(lineCells)
          throw new Error('Malformed sheet line.')
        }
        const isEmpty = lineCells.every(cell => !cell.value)
        const isFirst = line === 0
        const isHead = lineCells
        return {
          line: 12,
          type: 'empty',
          cells: []
        }
      })

      console.log(jsonSheetLines)

      // const JsonSheetCells: Array<JsonSheetCell[]> = tsv.split('\t')
      //   .map((lineStr: string): string[] => lineStr.split('\n'))
      //   .map((line: string[], linePos: number): string[] => line.map((cellStr: string): string => {
      //     const isEnc: string[]|null = cellStr.match(tsvComplexCellRegex)
      //     const returned: string = cellStr
      //       .replace(tsvComplexCellOpeningTag, '')
      //       .replace(tsvComplexCellClosingTag, '')
      //     return isEnc ? window.atob(returned) : returned
      //   }))
      
      //   const jsonSheet: JsonSheet = { cells: JsonSheetCells }


      // const rawJson: Array<string[]> = tsv
      //   .split('\n')
      //   .map((lineStr: string): string[] => lineStr.split('\t'))
      //   .map((line: string[], linePos: number): string[] => line.map((cellStr: string): string => {
      //     const isEnc: string[]|null = cellStr.match(tsvComplexCellRegex)
      //     const returned: string = cellStr
      //       .replace(tsvComplexCellOpeningTag, '')
      //       .replace(tsvComplexCellClosingTag, '')
      //     return isEnc ? window.atob(returned) : returned
      //   }))
      
      // const longestLine: number = Math.max(...rawJson.map((line: string[]) => line.length))
      // const json: Array<string[]> = rawJson.map((line: string[]) => Object.assign(new Array(longestLine).fill(''), line))
      // const jsonHead: string[] = json[0]
      // const headlessJson: Array<string[]> = json.slice(1)

      // // Start reading and interpreting data 
      // const keysColNb: number = jsonHead.indexOf('key')
      // const labelsColNb: number = jsonHead.indexOf('label')
      // const typesColNb: number = jsonHead.indexOf('type')

      

      // interface CollectionHead {
      //   key: string|undefined,
      //   label: string|undefined,
      //   type: 'id',
      //   start_line: number,
      //   end_line?: number
      // }

      // const collectionsHeadLines: CollectionHead[] = headlessJson
      //   .map((line: string[], linePos: number): CollectionHead|undefined => {
      //     const foundType: string|undefined = line[typesColNb]
      //     if (foundType !== 'id') return undefined
      //     const key: string|undefined = line[keysColNb]
      //     const label: string|undefined = line[labelsColNb]
      //     const type: 'id' = 'id'
      //     const start_line: number = linePos + 1
      //     return (type === 'id') ? { key, label, type, start_line } : undefined
      //   })
      //   .filter((line: CollectionHead|undefined): boolean => line !== undefined)
      //   .map((line) => line as CollectionHead)

      // const collections = collectionsHeadLines.map((headLine: CollectionHead, collectionPos: number) => {
      //   const nextColHead: CollectionHead|undefined = collectionsHeadLines[collectionPos + 1]
      //   const end_line: number = nextColHead ? nextColHead.start_line - 1 : headlessJson.length
      //   const collectionLines = json.slice(headLine.start_line + 1, end_line)
        
      //   const head: CollectionHead = { ...headLine, end_line }
      //   const ids: string[] = headLine.filter((cell: string, col: number): boolean => {
      //     return [keysColNb, labelsColNb, typesColNb].indexOf(col) === -1
      //   })
      //   console.log(ids)
        
      //   const rawLines: Array<string[]> = collectionLines
      //   const objects = []
        
      //   collectionLines.forEach((line: string[]) => {
      //     const key: string|undefined = line[keysColNb]
      //     const label: string|undefined = line[labelsColNb]
      //     const type: string|undefined = line[typesColNb]

      //     console.log(key, label, type)
      //   })

      //   return {
      //     key: headLine.key,
      //     label: headLine.label,
      //     start_line: headLine.start_line,
      //     end_line: end_line
      //   }
      // })

      // const colsToDelete: number[] = [keysColNb, labelsColNb, typesColNb]








      // const collectionsHeadLines: <Array<string[]> = json.slice(1).map(((line: string[], linePos: number) => {
      //   return ['lol']
      //   // const key = line[keysColNb]
      //   // const label = line[labelsColsNb]
      //   // const type = line[typesColNb]
      //   // return (type === 'id') ? { key, label, type, pos: linePos } : undefined
      // }))






      // interface SmartSheetColumn {}
      // interface SmartSheetLine {
      //   key: string|undefined,
      //   label: string | undefined,
      //   type: string | undefined,
      //   pos: number,
      //   cells: Array<SmartSheetCell>
      // }
      // interface SmartSheetCell {}

      // const columns: Array<SmartSheetColumn> = []
      // const lines: Array<SmartSheetLine> = json.map((line: string[], linePos: number): SmartSheetLine => {
      //   const key: string|undefined = line[keysColNb]
      //   const label: string|undefined = line[labelsColNb]
      //   const type: string|undefined = line[typesColNb]
      //   const pos: number = linePos
      //   const cells: Array<SmartSheetCell> = line.map((cell: string, colPos: number): SmartSheetCell => {
      //     return {}
      //   })
      //   return { key, label, type, pos, cells }
      // })

      // console.log(json)
      
    } catch (err) {
      console.log(err)
      alert('ERRRRR')
    }
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render () {
    return <div>
      My app.
    </div>
  }
}

export default App
