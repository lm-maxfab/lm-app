import React, { Component } from 'react'

interface AppProps {}

class App extends Component {
  constructor (props: AppProps) {
    super(props)
  }

  async componentDidMount () {
    try {
      // Fetch data
      const tsvBlob = await window.fetch('https://assets-decodeurs.lemonde.fr/sheets/M76L8xg8JCyheXG-n84Lytui-i0ZMg_634')
      const tsv: string = await tsvBlob.text()
      
      // Any TSV to JSON with normalized lines
      const rawJson: Array<Array<string>> = tsv.split('\n').map((line: string) => line.split('\t'))
      const longestLine: number = Math.max(...rawJson.map((line: string[]) => line.length))
      const jsonSheet: Array<Array<string>> = rawJson.map((line: string[]) => Object.assign(new Array(longestLine).fill(''), line))
      
      // Infer a structured spreadsheet
      // Read head
      const headLine: string[] = jsonSheet[0]
      const keysColNb: number = headLine.indexOf('key')
      const labelsColNb: number = headLine.indexOf('label')
      const typesColNb: number = headLine.indexOf('type')
      const colsToDelete: number[] = [keysColNb, labelsColNb, typesColNb]
      
      // Read data
      interface DataCell {
        data: string,
        col: number,
        line: number
      }

      interface DataLine {
        key: string | undefined,
        label: string | undefined,
        type: string | undefined,
        cells: DataCell[],
        line: number
        isPageHead: boolean
      }

      interface CollectionHeadLine {
        key: string,
        label: string | undefined,
        type: string | undefined,
        cells: DataCell[],
        line: number
        isPageHead: true
      }

      const dataLines = jsonSheet.slice(1)
        .map((lineArr: string[], line: number): DataLine => {
          const key: string | undefined = keysColNb > -1 ? lineArr[keysColNb] : undefined
          const label: string | undefined = labelsColNb > -1 ? lineArr[labelsColNb] : undefined
          const type: string | undefined = typesColNb > -1 ? lineArr[typesColNb] : undefined
          const isPageHead: boolean = type === 'id'
          const cells: DataCell[] = lineArr
            .map((data: string, col: number): DataCell => ({ data, col, line }))
            .filter((cell: DataCell): boolean => colsToDelete.indexOf(cell.col) !== -1)
          return { key, label, type, cells, line, isPageHead }
        })

      const headLines: CollectionHeadLine[] = dataLines
        .map((line: DataLine): DataLine => line)
        .filter((line: DataLine): boolean => line.isPageHead)
        .map((line: DataLine): CollectionHeadLine => ({ ...line }))


      // interface CollectionHeadLine {
      //   key: string,
      //   label: string | undefined,
      //   type: 'id',
      //   data: string[],
      //   isPageHead: true,
      //   lineNb: number
      // }

      // const smartDataLines = dataLines.map((line: string[], lineNb: number) => {
      //   const key = keysColNb > -1 ? line[keysColNb] : undefined
      //   const label = labelsColNb > -1 ? line[labelsColNb] : undefined
      //   const type = typesColNb > -1 ? line[typesColNb] : undefined
      //   const isPageHead = type === 'id'
      //   const data = line
      //     .map((cell: string, colNb: number) => ({ cell, colNb }))
      //     .filter((data: { cell: string, colNb: number }) => {
      //       return [keysColNb, labelsColNb, typesColNb].indexOf(data.colNb) !== -1
      //     })
      //   const returned = {
      //     key,
      //     label,
      //     type,
      //     data,
      //     isPageHead,
      //     lineNb: lineNb + 1
      //   }
      //   return returned
      // })


      // const collectionHeads = smartDataLines.filter((line: { isPageHead: boolean }) => line.isPageHead)


      // const collections = collectionHeads.map((headLine, collectionNb: number) => {
      //   const key = headLine.key
      //   console.log('---', key)
      //   // const key: string = headLine.key
      //   // const label: string = headLine.label
      //   // const startLine: number = headLine.lineNb + 1
      //   // return { key, label, startLine }
      // })
      
    } catch (err) {
      console.log(err)
      alert('ERRRRR')
    }
  }

  render () {
    return <div>
      My app.
    </div>
  }
}

export default App
