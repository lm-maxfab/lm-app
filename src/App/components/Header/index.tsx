import React, { Component, ReactNode } from 'react'
import clss from 'classnames'
import styles from './styles.module.css'
import FancyHover from '../FancyHoverableText'

interface Props {
  className?: string
  style?: React.CSSProperties
  title?: string
  credits?: JSX.Element
}

interface State {
  titleHovered: boolean
}

class Header extends Component<Props, State> {
  state = { titleHovered: false }

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.handleTitleEnter = this.handleTitleEnter.bind(this)
    this.handleTitleLeave = this.handleTitleLeave.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  handleTitleEnter (e: React.MouseEvent) { this.setState({ titleHovered: true }) }
  handleTitleLeave (e: React.MouseEvent) { this.setState({ titleHovered: false }) }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): ReactNode {
    const { props, state } = this
    const classes: string = clss('prenoms-head', styles['wrapper'], props.className)
    const inlineStyle = { ...props.style }

    const titleLines = props.title?.split('<br />') ?? []

    return (
      <div className={classes} style={inlineStyle}>
        <h1
          className={styles['headline']}
          onMouseEnter={this.handleTitleEnter}
          onMouseLeave={this.handleTitleLeave}>
          <FancyHover
            animationSpeed='500ms'
            fillEndColor='rgba(var(--c-prenoms-black))'
            fillSlant='-45deg'
            fillStartColor='rgba(var(--c-prenoms-beige))'
            shadowColor='rgba(var(--c-prenoms-black))'
            shadowDefinition={16}
            shadowSize='2px'
            hover={state.titleHovered}>
            {titleLines[0]}
          </FancyHover>
          <span>{titleLines[1]}</span>
          <FancyHover
            animationSpeed='500ms'
            fillEndColor='rgba(var(--c-prenoms-black))'
            fillSlant='-45deg'
            fillStartColor='rgba(var(--c-prenoms-beige))'
            shadowColor='rgba(var(--c-prenoms-black))'
            shadowDefinition={16}
            shadowSize='2px'
            hover={state.titleHovered}>
            {titleLines[2]}
          </FancyHover>
        </h1>
        <img
          className={styles['cradle']}
          src='https://assets-decodeurs.lemonde.fr/redacweb/1-2105-prenoms-assets/berceau.png' />
        <p className={styles['signature']}>
          {props.credits}
        </p>
      </div>
    )
  }
}

export type { Props, State }
export default Header
