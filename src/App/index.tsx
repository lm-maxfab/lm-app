import { Component, JSX } from 'preact'
import { SheetBase } from '../modules/le-monde/utils/sheet-base'
import './styles.css'
import bem, { BEM } from '../modules/le-monde/utils/bem'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheetBase?: SheetBase
}

class App extends Component<Props, {}> {
  bem: BEM = bem('lm-app')

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Extract data
    const classes = this.bem.block(props.className).value
    const inlineStyle: JSX.CSSProperties = {
      ...props.style,
      paddingTop: '70px',
      background: 'coral'
    }

    // Display
    return (
      <div className={classes} style={inlineStyle}>
        {props.sheetBase !== undefined && props.sheetBase.collections.map(collection => {
          return <div>
            <div><strong>COLLECTION: {collection.name}</strong></div>
            <div>
              {collection.entries.map(entry => (
                <div>
                  {entry.id} - {entry.fields.length} fields.
                </div>
              ))}
            </div>
          </div>
        })}
      </div>
    )
  }
}

export type { Props }
export default App
