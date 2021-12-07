import { Component, JSX } from 'preact'
import Paginator, { Page } from '../../../modules/le-monde/components/Paginator'
import bem from '../../../modules/le-monde/utils/bem'
import { Destination as DestinationType } from '../../types'
import Destination from '../Destination'

import './styles.scss'

interface Props {
  className?: string
  style?: JSX.CSSProperties
  entries: DestinationType[]
}

interface State {
  currentEntry: DestinationType|null
}

class Destinations extends Component<Props, State> {
  clss = 'dest22-destinations'
  state: State = {
    currentEntry: null
  }

  constructor (props: Props) {
    super(props)
    this.getEntryById = this.getEntryById.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
  }

  getEntryById (id: DestinationType['id']) {
    return this.props.entries.find(entry => entry.id === id)
  }

  handlePageChange (val: DestinationType['id']) {
    const currentEntry = this.getEntryById(val)
    this.setState({ currentEntry: currentEntry ?? null })
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|null {
    const { props, state } = this
    const { entries } = props

    /* Classes and style */
    const wrapperClasses = bem(props.className ?? '').block(this.clss)
    // const firstEntryMainColor = props.entries[0].main_color ?? 'var(--c-content-bg)'
    const wrapperStyle: JSX.CSSProperties = {
      // ['--c-first-entry-main-color']: firstEntryMainColor,
      // ['--c-content-bg']: state.currentEntry?.main_color ?? 'var(--c-first-entry-main-color)',
      ...props.style
    }

    /* Display */
    return <div
      style={wrapperStyle}
      className={wrapperClasses.value}>
      <div className={bem(this.clss).elt('before-first').value}></div>
      <Paginator
        triggerBound='bottom'
        onPageChange={this.handlePageChange}>
        {entries.map((entry, entryPos) => {
          return <Page value={entry.id}>
            <Destination
              data={entry}
              position={entryPos + 1} />
          </Page>
        })}
      </Paginator>
    </div>
  }
}

export type { Props }
export default Destinations
