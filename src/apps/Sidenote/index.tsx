import { Component, JSX } from 'preact'
import appWrapper, { InjectedProps } from '../../modules/utils/app-wrapper-HOC'
import { SidenoteData } from '../types'
import styles from './styles.module.scss'

interface Props extends InjectedProps { }
interface State { }

class Sidenote extends Component<Props, State> {

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render(): JSX.Element {

    const { props } = this

    const sidenoteClass = 'lm-pedocrim__sidenote'
    const sidenoteData = props.sheetBase?.collection('sidenote_data').value[0] as unknown as SidenoteData;

    const wrapperClasses = [
      sidenoteClass,
      sidenoteData.customClass,
      styles['wrapper']
    ]

    return <div className={wrapperClasses.join(' ')}>
      {sidenoteData.customCss && <style>{sidenoteData.customCss}</style>}
      {sidenoteData.content ?? ''}
    </div>
  }
}

export type { Props, Sidenote }
export default appWrapper(Sidenote)
