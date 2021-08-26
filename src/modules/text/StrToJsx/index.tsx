import React from 'react'
import parser from './parser'

interface Props {
  content?: string
}

class StrToJsx extends React.Component<Props, {}> {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): React.ReactNode {
    const toParse = this.props.content ?? ''
    return <>{parser(toParse)}</>
  }
}

export type { Props }
export default StrToJsx
