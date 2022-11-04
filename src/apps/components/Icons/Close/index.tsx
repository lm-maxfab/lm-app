import { Component } from 'preact'
import bem from '../../../../modules/utils/bem'
import './styles.scss'

type Props = {
  color?: string,
}

type State = {
}

export const className = bem('mondial-closeicon')

export default class Close extends Component<Props, State> {
  render () {
    const fillColor = this.props.color ?? '#fff'

    return  <svg className={className.value} width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill={fillColor} fill-rule="evenodd" clip-rule="evenodd" d="M9.55509 10.6745L5.07742 15.1522L3.95801 14.0328L8.43567 9.55509L3.95801 5.07742L5.07742 3.95801L9.55509 8.43567L14.0328 3.95801L15.1522 5.07742L10.6745 9.55509L15.1522 14.0328L14.0328 15.1522L9.55509 10.6745Z" />
    </svg>
  }
}
