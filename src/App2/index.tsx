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
  vhIntervaller: number|undefined = undefined

  constructor (props: Props) {
    super(props)
    this.storeViewportDimensionsAsCssVariables = this.storeViewportDimensionsAsCssVariables.bind(this)
  }

  componentDidMount () {
    this.storeViewportDimensionsAsCssVariables()
    this.vhIntervaller = window.setInterval(this.storeViewportDimensionsAsCssVariables, 500)
  }

  componentWillUnmount () {
    window.clearInterval(this.vhIntervaller)
  }

  storeViewportDimensionsAsCssVariables () {
    const head = document.querySelector('head')
    if (head === null) return
    const foundStyle = head.querySelector('style#js-injected-style-for-vh')
    const viewportHeight = document.documentElement.clientHeight
    const viewportWidth = document.documentElement.clientWidth
    const css = `.lm-app-root {
      --len-100-vh: ${viewportHeight}px;
      --len-100-vw: ${viewportWidth}px;
    }`
    if (foundStyle) {
      foundStyle.innerHTML = css
    } else {
      const style = document.createElement('style')
      style.setAttribute('id', 'js-injected-style-for-vh')
      style.innerHTML = css
      head.appendChild(style)
    }
  }
  
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
