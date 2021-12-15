import { Component, JSX } from 'preact'
import wrapper, { InjectedProps } from '../../wrapper'
import bem from '../../modules/le-monde/utils/bem'
import './styles.scss'

interface Props extends InjectedProps {}

class MyApp extends Component<Props, {}> {
  static clss: string = 'my-app'
  clss = MyApp.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Assign classes
    const wrapperClasses = bem(props.className).block(this.clss)
    const wrapperStyle: JSX.CSSProperties = {
      ...props.style,
      marginTop: 'var(--len-nav-height)'
    }

    // Display
    return (
      <div
        style={wrapperStyle}
        className={wrapperClasses.value}>
        <pre style={{ maxWidth: '100%', overflowX: 'scroll' }}>
          <b>Props</b>: {
          JSON.stringify({
            className: props.className,
            style: props.style,
            viewportDimensions: props.viewportDimensions,
            sheetBase: props.sheetBase.collections.map(collection => ({
              collection_name: collection.name,
              collection_entries: collection.entries.map(entry => {
                const returned: any = { id: entry.id }
                entry.fields.forEach(field => {
                  returned[field.name] = `${field.type}('${field.raw}')`
                })
                return returned
              })
            }))
          }, null, 2)
        }</pre>
      </div>
    )
  }
}

export type { Props, MyApp }
export default wrapper(MyApp)
