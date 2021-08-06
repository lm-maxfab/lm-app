import React from 'react'
import clss from 'classnames'
import type { SheetBase } from '../modules/spreadsheets/tsv-base-to-js-object-base'
import AppContext from '../context'
import './styles.css'
import Slide from './components/Slide'

interface Props {
  className?: string
  style?: React.CSSProperties
  sheet_data?: SheetBase
}

class App extends React.Component<Props> {
  static contextType = AppContext

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props, context } = this
    const mainClass = 'lm-app'
    const classes: string = clss(
      mainClass,
      props.className
    )
    const inlineStyle = { ...props.style }

    const allPages = props.sheet_data?.value.pages ?? []
    const pages = allPages.filter(page => page.publish === true)

    return (
      <div
        id={context.config.project_short_name}
        className={classes}
        style={inlineStyle}>
        {pages.map(page => (
          <Slide
            key={page.id}
            data={page} />
        ))}
      </div>
    )
  }
}

export type { Props }
export default App
