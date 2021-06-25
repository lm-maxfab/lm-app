import React from 'react'
import clss from 'classnames'
import styles from './styles.module.css'
import Spreadsheet from '../modules/spreadsheets/Spreadsheet'
import type { SheetBase } from '../modules/spreadsheets/tsv-base-to-js-object-base'
import App from '../App'
import preload from '../preload'

interface Props {
  className?: string
  style?: React.CSSProperties
}

interface State {}

class App2 extends React.Component<Props, State> {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props } = this
    const isInApp = window.location.href.match(/apps.([a-z]+\-)?lemonde.fr/)
    const classes: string = clss(
      'app-2',
      isInApp ? 'app-2_app' : 'app-2_website',
      styles['wrapper'],
      props.className
    )
    const inlineStyle = { ...props.style }
    return (
      <div className={classes} style={inlineStyle}>
        <Spreadsheet
          preload={preload}
          url='https://assets-decodeurs.lemonde.fr/sheets/M76L8xg8JCyheXG-n84Lytui-i0ZMg_634'
          render={(data: SheetBase) => <App data={data} />} />
      </div>
    )
  }
}

export type { Props }
export default App2
