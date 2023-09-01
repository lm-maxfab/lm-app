import { Component } from 'preact'
import bem from '../../../../modules/utils/bem'
import './styles.scss'

type Props = {
  fill?: string,
  stroke?: string,
}

type State = {
}

export const className = bem('mondial-scrollicon')

export default class ScrollIcon extends Component<Props, State> {
  render() {
    const fillColor = this.props.fill ?? '#0E121733'
    const strokeColor = this.props.stroke ?? '#ffffff'

    return <svg className={className.value} width="78" height="88" viewBox="0 0 78 88" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M53.9589 11.8441C59.8997 14.6847 63.7159 20.7676 64.9704 28.4891C66.2242 36.2061 64.8917 45.4617 60.6185 54.3986C56.3453 63.3355 49.9778 70.1835 43.184 74.0526C36.3864 77.9239 29.2558 78.7726 23.3151 75.932C17.3743 73.0914 13.5581 67.0084 12.3036 59.287C11.0498 51.5699 12.3823 42.3144 16.6555 33.3775C20.9287 24.4406 27.2962 17.5925 34.09 13.7234C40.8876 9.85212 48.0182 9.00347 53.9589 11.8441Z" fill={fillColor} />
      <path d="M53.9589 11.8441C59.8997 14.6847 63.7159 20.7676 64.9704 28.4891C66.2242 36.2061 64.8917 45.4617 60.6185 54.3986C56.3453 63.3355 49.9778 70.1835 43.184 74.0526C36.3864 77.9239 29.2558 78.7726 23.3151 75.932C17.3743 73.0914 13.5581 67.0084 12.3036 59.287C11.0498 51.5699 12.3823 42.3144 16.6555 33.3775C20.9287 24.4406 27.2962 17.5925 34.09 13.7234C40.8876 9.85212 48.0182 9.00347 53.9589 11.8441Z" stroke={strokeColor} stroke-width="2" />
      <path d="M44.1672 51.9348L33.4092 56.464L28.2368 46" stroke={strokeColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M40.7234 59.4944L29.9653 64.0236L24.793 53.5595" stroke={strokeColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  }
}
