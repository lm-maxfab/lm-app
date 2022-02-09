import { Component, JSX } from 'preact'
import bem from '../../../modules/le-monde/utils/bem'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  isActive?: boolean
}

class Intro extends Component<Props, {}> {
  static clss = 'covid-intro'
  clss = Intro.clss

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this

    /* Classes and style */
    const wrapperClasses = bem(props.className)
      .block(this.clss)
      .mod({ inactive: !props.isActive })
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
      <div
        style={wrapperStyle}
        className={wrapperClasses.value}>
        <div className={bem(this.clss).elt('inner').value}>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum finibus lobortis sodales. Cras laoreet viverra mollis. Nam urna felis, congue nec facilisis et, sodales quis nibh. Phasellus ex neque, volutpat a viverra sed, porttitor sit amet dui. Morbi nec diam ultrices lacus venenatis convallis. Vestibulum aliquet, justo sit amet vehicula tristique, magna mi gravida ante, vitae luctus nisl libero et nunc. Integer facilisis pellentesque orci et tincidunt. Curabitur gravida felis at massa semper, ac gravida tortor scelerisque. Cras ornare est a hendrerit aliquet. Etiam vulputate at velit eget porta. Maecenas faucibus eu mauris id lobortis.</p>
          <p>Donec in porttitor sem, nec interdum nunc. Phasellus metus magna, vestibulum nec pharetra eget, accumsan sed augue. Nunc egestas justo eu sem lobortis semper. Ut mattis est a dictum semper. Pellentesque ut porta diam. Cras eu turpis vitae eros molestie semper. Phasellus non magna convallis, iaculis nunc vel, maximus orci. Vivamus finibus dapibus libero sit amet interdum. Fusce suscipit laoreet metus, sed porttitor eros pulvinar vel.</p>
        </div>
      </div>
    )
  }
}

export type { Props }
export default Intro
