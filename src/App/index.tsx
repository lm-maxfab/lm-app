import { Component, JSX } from 'preact'
import { SheetBase } from '../modules/le-monde/utils/sheet-base'
import bem, { BEM } from '../modules/le-monde/utils/bem'
import Slider from './components/Slider'
import './styles.css'
import { SlideData } from './types'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  sheetBase?: SheetBase
}

class App extends Component<Props, {}> {
  bem: BEM = bem('lm-app').block('fraude')

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element {
    const { props } = this

    // Logic
    const slides: SlideData[] = (props.sheetBase?.collection('slides').value ?? []) as unknown as SlideData[]

    // Extract data
    const classes = this.bem.block(props.className)
    const inlineStyle: JSX.CSSProperties = {
      ...props.style,
      '--nav-height': '62px',
      paddingTop: 'var(--nav-height)'
    }

    // Display
    return (
      <div className={classes.value} style={inlineStyle}>
        <Slider data={slides} />
      </div>
    )
  }
}

export type { Props }
export default App
