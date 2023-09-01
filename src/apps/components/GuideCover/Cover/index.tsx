import { Component, VNode } from 'preact'
import Gradient from '../../Gradient'
import Marker from '../../Marker'
import ScrollIcon from '../../Icons/ScrollIcon'
import bem from '../../../../modules/utils/bem'
import './styles.scss'

import getConfig from '../../../../modules/utils/get-config'
import ArticleHeader from '../../../../modules/components/ArticleHeader'

const config = getConfig()

type Props = {
  currentStep?: number,
  title?: string | VNode,
  intro?: string | VNode,
}

type State = {
}


interface Cover {
  stepClass?: string,
  lastStep?: undefined | number,
}

export const className = bem('mondial-guide-cover')

class Cover extends Component<Props, State> {
  state: State = {
  }

  constructor(props: Props) {
    super(props)
    this.stepClass = 'init'
    this.lastStep = undefined
  }

  componentDidUpdate(): void {
    this.lastStep = this.props.currentStep ?? 0
  }

  render() {
    if (this.lastStep === 0 && this.props.currentStep === 1) {
      this.stepClass = 'out'
    } else if (this.props.currentStep === 0 && this.stepClass != 'init') {
      this.stepClass = 'back'
    }

    const shapeSrc = `https://assets-decodeurs.lemonde.fr/redacweb/51-2309-mondial-rugby/shape-guide-cover.svg`
    const shapeMobileSrc = `https://assets-decodeurs.lemonde.fr/redacweb/51-2309-mondial-rugby/shape-guide-cover-mobile.svg`

    return <div className={className.mod(this.stepClass).value}>

      <div className={className.elt('container').value}>

        <div className={className.elt('gradient').value}>
          <Gradient angle={66} />
        </div>

        <img
          src={shapeSrc}
          className={className.elt('shape').mod('desktop').value} />

        <img
          src={shapeMobileSrc}
          className={className.elt('shape').mod('mobile').value} />

        <div className={className.elt('home-container').value}>

          <div className={className.elt('home-grid').value}>

            <ArticleHeader
              fill1='#fff'
              fill2='rgb(255,255,255,0.6)' />

            {/* <div className={className.elt('marker').value}>
                <Marker color='#fff' />
              </div> */}
            <h1 className={className.elt('title').value}>
              {this.props.title}
            </h1>

            <h2 className={className.elt('intro').value}>{this.props.intro}</h2>

            {/* <div className={className.elt('scrollicon').value}>
                <ScrollIcon />
              </div> */}

          </div>

        </div>
      </div>
    </div>
  }
}

export default Cover