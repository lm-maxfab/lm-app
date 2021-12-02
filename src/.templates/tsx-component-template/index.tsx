import { Component, JSX } from 'preact'
<<<<<<< HEAD:src/.templates/tsx-component-template/index.tsx
import bem, { BEM } from '../../modules/le-monde/utils/bem'
=======
import bem from '../../modules/le-monde/utils/bem'
>>>>>>> master:.templates/tsx-component-template/index.tsx
import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
}

class Template extends Component<Props, {}> {
  clss = 'TEMPLATE'

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props } = this
<<<<<<< HEAD:src/.templates/tsx-component-template/index.tsx
    const classes = this.bem.block(props.className)
    const inlineStyle: JSX.CSSProperties = { ...props.style }
=======
>>>>>>> master:.templates/tsx-component-template/index.tsx

    /* Classes and style */
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    const wrapperStyle: JSX.CSSProperties = { ...props.style }

    /* Display */
    return (
<<<<<<< HEAD:src/.templates/tsx-component-template/index.tsx
      <div className={classes.toString()} style={inlineStyle}>
=======
      <div className={wrapperClasses.value} style={wrapperStyle}>
>>>>>>> master:.templates/tsx-component-template/index.tsx
        TSX component template.
      </div>
    )
  }
}

export type { Props }
export default Template
