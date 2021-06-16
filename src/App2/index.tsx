import React from 'react'
import clss from 'classnames'
import styles from './styles.module.css'
import Spreadsheet from '../modules/spreadsheets/Spreadsheet'
import App from '../App'

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
    const classes: string = clss('app-2', styles['wrapper'], props.className)
    const inlineStyle = { ...props.style }
    return (
      <div className={classes} style={inlineStyle}>
        <Spreadsheet
          preload={[1, 2, 3]}
          url='https://assets-decodeurs.lemonde.fr/sheets/M76L8xg8JCyheXG-n84Lytui-i0ZMg_634'
          render={(data:any) => <App data={data} />} />
      </div>
    )
  }
}

export type { Props }
export default App2
