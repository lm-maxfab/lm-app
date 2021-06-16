import React from 'react'
import clss from 'classnames'
import styles from './styles.module.css'
import Parallax from './components/Parallax'
import Header from './components/Header'
import Intro from './components/Intro'
import Name from './components/Name'
import GoNext from './components/GoNext'
import type { Props as NameProps } from './components/Name'
import berceauSrc from './assets/berceau.png'
import baguetteSrc from './assets/fee-baguette.png'
import poidsSrc from './assets/fee-poids.png'

interface Props {
  className?: string
  style?: React.CSSProperties
  data: NameProps[]
}

interface State {
  currentName: string|null
}

class App extends React.Component<Props, State> {
  state: State = { currentName: null }
  $root: HTMLDivElement|null = null

  /* * * * * * * * * * * * * * *
   * CONSTRUCTOR
   * * * * * * * * * * * * * * */
  constructor (props: Props) {
    super(props)
    this.activateName = this.activateName.bind(this)
    this.handleGoNextClick = this.handleGoNextClick.bind(this)
  }

  /* * * * * * * * * * * * * * *
   * ACTIVATE NAME
   * * * * * * * * * * * * * * */
  async activateName (name: string|null) {
    await new Promise(resolve => {
      this.setState((curr: State) => {
        if (curr.currentName === name) return { ...curr, currentName: null }
        else return { ...curr, currentName: name }
      }, () => resolve(true))
    })
    if (this.$root === null || this.state.currentName === null) return
    const $name: Element|null = this.$root.querySelector(`#${name}`)
    if ($name === null) return
    const nameY = $name.getBoundingClientRect().top
    const windowY = window.pageYOffset
    const offsetY = -2 * 16
    const yScrollTarget = nameY + windowY + offsetY
    window.scrollTo({
      top: yScrollTarget,
      behavior: 'smooth'
    })
  }

  /* * * * * * * * * * * * * * *
   * HANDLE GO NEXK CLICK
   * * * * * * * * * * * * * * */
  handleGoNextClick (e: React.MouseEvent) {
    const currentName = this.state.currentName
    const currPos = this.props.data.findIndex(name => name.name === currentName)
    const nextPos = currPos + 1
    if (nextPos === this.props.data.length) return
    const nextName = this.props.data[nextPos].name
    this.activateName(nextName)
  }
  
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props, state } = this
    const classes: string = clss('lm-app', 'prenoms', styles['app'], props.className)
    const inlineStyle = { ...props.style }
    const currentName = state.currentName
    const currentNamePos = props.data.findIndex((name: NameProps) => name.name === currentName)
    const currentNameIsLast = currentNamePos === props.data.length - 1

    const Names = () => (
      <div className={styles['names']}>
        {props.data.map((name: NameProps, i: number): React.ReactNode => {
          const expanded = currentName === name.name
          const onToggle = () => { this.activateName(name.name) }
          return <div
            key={name.name}
            id={name.name}
            className={styles['name']}
            style={{ top: '200px' }}>
            <Name
              {...name}
              expanded={expanded}
              onToggle={onToggle} />
          </div>
        })}
      </div>
    )

    return (
      <div
        className={classes}
        style={inlineStyle}
        ref={n => this.$root = n}>
        <div className={styles['parallax']}>
          <Parallax
            anchor='top'
            render={(percent: number):React.ReactNode => {
              const opacity = Math.pow(1 - percent, 4)
              const berceauStyle:React.CSSProperties = { opacity, top: `${percent * 27 * 1.8}%` }
              const baguetteStyle:React.CSSProperties = { opacity, top: `${percent * 18 * 1.8}%` }
              const poidsStyle:React.CSSProperties = { opacity, top: `${percent * 9 * 1.8}%` }
              return <>
                <img
                  src={berceauSrc}
                  className={clss(styles['parallax-asset'], styles['parallax-asset_berceau'])}
                  style={berceauStyle} />
                <img
                  src={baguetteSrc}
                  className={clss(styles['parallax-asset'], styles['parallax-asset_baguette'])}
                  style={baguetteStyle} />
                <img
                  src={poidsSrc}
                  className={clss(styles['parallax-asset'], styles['parallax-asset_poids'])}
                  style={poidsStyle} />
              </>
            }} />
        </div>
        <Header className={styles['header']} />
        <Intro className={styles['intro']} />
        <Names />
        {currentName
          && !currentNameIsLast
          && <div
            onClick={this.handleGoNextClick}
            className={styles['go-next']}>
            <GoNext />
          </div>}
      </div>
    )
  }
}

export type { Props }
export default App
