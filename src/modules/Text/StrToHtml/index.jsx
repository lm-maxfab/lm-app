import React from 'react'
import { Parser } from 'html-to-react'

const h2r = new Parser()

class StrToHtml extends React.Component {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render () {
    const { props } = this
    const parsed = h2r.parse(props.content ?? '')
    return <>{parsed}</>
  }
}

export default StrToHtml
