import React from 'react'
import tsvBaseToJsObjectBase from '../tsv-base-to-js-object-base'
import fetchTsvBase from '../fetch-tsv-base'
import { SheetBase } from '../tsv-base-to-js-object-base'

interface Props {
  preload?: string
  url?: string
  render?: (data: SheetBase) => React.ReactNode
}

interface State {
  loading: boolean
  error: Error|null
  data: SheetBase|undefined
}

class Spreadsheet extends React.Component<Props, State> {
  state: State = {
    loading: false,
    error: null,
    data: undefined
  }

  constructor (props: Props) {
    super(props)
    this.fetchData = this.fetchData.bind(this)
  }

  componentDidMount () {
    this.fetchData()
  }

  componentDidUpdate () {
    // Check if data or preload has changed
  }

  async fetchData () {
    const { preload, url } = this.props
    const hasPreload = preload !== undefined
    const hasUrl = url !== undefined
    if (!hasPreload && !hasUrl) {
      this.setState({ loading: false, error: null, data: undefined })
    } else if (hasPreload && !hasUrl) {
      const preloadedBase = tsvBaseToJsObjectBase(preload as string)
      this.setState({ loading: false, error: null, data: preloadedBase })
    } else if (hasUrl)  {
      const preloadedBase = hasPreload ? tsvBaseToJsObjectBase(preload as string) : undefined
      this.setState({ loading: true, error: null, data: preloadedBase })
      try {
        const fetched = await fetchTsvBase(url as string)
        const fetchedBase = tsvBaseToJsObjectBase(fetched)
        this.setState({ loading: false, error: null, data: fetchedBase })
      } catch (err) {
        this.setState({ loading: false, error: err, data: undefined })
      }
    }
  }

  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const { props, state } = this
    if (props.render === undefined) return null
    else if (state.error !== null) {
      const error = state.error
      return (
        <div>
          <p>Something went wrong</p>
          <p>{error.message}</p>
        </div>
      )
    } else if (state.data === undefined
      && state.loading !== null) {
      return <div>Loading...</div>
    } else if (state.data === undefined) {
      return <div>The spreadsheet contains no data.</div>
    } else {
      return props.render(state.data)
    }
  }
}

export type { Props, State }
export default Spreadsheet
