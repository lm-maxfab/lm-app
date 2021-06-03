import React from 'react'
import clss from 'classnames'
import styles from './styles.module.css'
import FancyHover from '../FancyHoverableText'
import StrToHtml from '../../../modules/Text/StrToHtml'

interface Props {
  className?: string
  style?: React.CSSProperties
  name: string
  displayName: string
  intro: string
  text: string
  expanded?: boolean
  onToggle?: any
}

interface State {
  expanded: boolean
}

class Name extends React.Component<Props, State> {
  state: State = { expanded: false }

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.handleToggleClick = this.handleToggleClick.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * HANDLE TOGGLE CLICK
   * * * * * * * * * * * * * * */
  async handleToggleClick (e: React.MouseEvent) {
    if (typeof this.props.onToggle === 'function') await this.props.onToggle()
    await new Promise((resolve) => {
      this.setState(
        curr => ({ ...curr, expanded: !curr.expanded }),
        () => resolve(true)
      )
    })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props, state } = this
    const classes: string = clss('prenoms-name', styles.wrapper, props.className)
    const inlineStyle = { ...props.style }
    const expanded = props.expanded ?? state.expanded

    const textStyle: React.CSSProperties = {
      opacity: expanded ? 1 : 0,
      height: expanded ? 'auto' : 0,
      overflow: 'hidden',
      transition: 'opacity 1000ms, transform 1000ms'
    }

    return (
      <div className={classes} style={inlineStyle}>
        <div
          className={styles.head}
          onClick={this.handleToggleClick}>
          <FancyHover
            animationSpeed='1000ms'
            fillStartColor='rgba(var(--c-prenoms-beige))'
            fillEndColor='rgba(var(--c-prenoms-black))'
            shadowColor='rgba(var(--c-prenoms-black))'
            shadowDefinition={8}
            shadowSize='1.5px'
            hover={expanded ? true : undefined}>
            <span className='prenoms-name__name'>{props.displayName}</span>
            <span className='prenoms-name__name-intro'>{props.intro}</span>
          </FancyHover>
        </div>
        <div className={styles.text} style={textStyle}>
          <StrToHtml content={props.text} />
        </div>
        {!expanded && <button
          className={styles.toggle}
          onClick={this.handleToggleClick}>
          + Lire la suite
        </button>}
      </div>
    )
  }
}

export type { Props }
export default Name
