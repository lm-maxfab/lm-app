import React from 'react'
import clss from 'classnames'
import { ReactSVG } from 'react-svg'
import './styles.css'

interface Props {
  className?: string
  style?: React.CSSProperties
  src: string
}

class Svg extends React.Component<Props, {}> {
  mainClass: string = 'lm-svg'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props } = this
    const classes: string = clss(this.mainClass, props.className)
    const inlineStyle = { ...props.style }
    const passedProps = {
      ...props,
      className: undefined,
      style: undefined
    }

    return (
      <div className={classes} style={inlineStyle}>
        <ReactSVG
          renumerateIRIElements={false}
          fallback={() => <img alt='Not found.' src='' />}
          { ...passedProps } />
      </div>
    )
  }
}

export type { Props }
export default Svg
