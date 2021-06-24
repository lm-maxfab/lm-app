import React from 'react'
import clss from 'classnames'
import styles from './styles.module.css'
import Parallax from './components/Parallax'
import Header from './components/Header'
import Intro from './components/Intro'
import Name from './components/Name'
import GoNext from './components/GoNext'
import Outro from './components/Outro'
import type { Props as NameProps } from './components/Name'
import type { Credits as OutroCredits } from './components/Outro'
import type { SheetBase } from '../modules/spreadsheets/tsv-base-to-js-object-base'

interface Props {
  className?: string
  style?: React.CSSProperties
  data: SheetBase
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
    const { props, state } = this
    const sheetBase = props.data
    const names = sheetBase.value.names.filter(name => name.publish)
    const currentName = state.currentName
    const currPos = names.findIndex(entry => entry.id === currentName)
    const nextPos = currPos + 1
    if (nextPos === names.length) return
    const nextName = names[nextPos].id
    this.activateName(nextName)
  }
  
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props, state } = this
    const sheetBase = props.data
    const names = sheetBase.value.names.filter(name => name.publish)
    const settings = sheetBase.value.settings ? sheetBase.value.settings[0] : {}
    const credits: OutroCredits[] = sheetBase.value.credits as OutroCredits[]
    const currentName = state.currentName
    const currentNamePos = names.findIndex((entry) => entry.id === currentName)
    const currentNameIsLast = currentNamePos === names.length - 1
    
    const Names = () => (
      <div className={styles['names']}>
        {names.map((entry, i): React.ReactNode => {
          const expanded = currentName === entry.id
          const onToggle = () => { this.activateName(entry.id) }
          const nameProps: NameProps = {
            displayName: entry.display_name,
            intro: entry.intro,
            text: entry.text
          }
          return <div
            key={entry.id}
            id={entry.id}
            className={styles['name']}
            style={{ top: '200px' }}>
            <Name
              {...nameProps}
              expanded={expanded}
              onToggle={onToggle} />
          </div>
        })}
      </div>
    )

    const classes: string = clss('lm-app', 'prenoms', styles['app'], props.className)
    const inlineStyle = { ...props.style }

    return (
      <div
        className={classes}
        style={inlineStyle}
        ref={n => this.$root = n}>
        <div className={styles['content-wrapper']}>
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
                    src='https://assets-decodeurs.lemonde.fr/redacweb/1-2105-prenoms-assets/berceau.png'
                    className={clss(styles['parallax-asset'], styles['parallax-asset_berceau'])}
                    style={berceauStyle} />
                  <img
                    src='https://assets-decodeurs.lemonde.fr/redacweb/1-2105-prenoms-assets/fee-baguette.png'
                    className={clss(styles['parallax-asset'], styles['parallax-asset_baguette'])}
                    style={baguetteStyle} />
                  <img
                    src='https://assets-decodeurs.lemonde.fr/redacweb/1-2105-prenoms-assets/fee-poids.png'
                    className={clss(styles['parallax-asset'], styles['parallax-asset_poids'])}
                    style={poidsStyle} />
                </>
              }} />
          </div>
          <Header
            className={styles['header']}
            title={settings.title}
            credits={settings.credits} />
          <Intro
            className={styles['intro']}
            text={settings.introduction} />
          <Names />
        </div>
        <div className={styles['outro-wrapper']}>
          <Outro
            className={`${styles['outro']} ma-bitch`}
            outro={settings.outroduction}
            credits={credits} />
        </div>
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
