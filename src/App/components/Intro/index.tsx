import { Component, ReactNode } from 'react'
import clss from 'classnames'
import styles from './styles.module.css'

interface Props {
  className?: string
  style?: React.CSSProperties
}

class Intro extends Component<Props, {}> {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): ReactNode {
    const { props } = this
    const classes: string = clss('prenoms-intro', styles['wrapper'], props.className)
    const inlineStyle = { ...props.style }

    return (
      <div className={classes} style={inlineStyle}>
        <p>Morbi et felis ante. <em>Nullam lobortis enim ut enim</em> imperdiet ultrices. Pellentesque sed euismod tellus, accumsan sagittis lorem.</p>
        <p>Eu auctor risus <em>metus porttitor diam</em>. Praesent convallis lorem velit, ac dignissim tellus vestibulum in. Phasellus non sem ut orci <em>efficitur molestie vitae</em> a mi.</p>
      </div>
    )
  }
}

export type { Props }
export default Intro
