import { Component, JSX } from 'preact'

interface Props {
  content?: string
}

class StrToHtml extends Component<Props, {}> {
  /* * * * * * * * * * * * * * *
   * RENDER
   * * * * * * * * * * * * * * */
  render (): JSX.Element|string {
    const { props } = this

    // No content
    if (props.content === undefined || props.content === '') return <></>
    return <span dangerouslySetInnerHTML={{ __html: props.content ?? '' }} />
  }
}

export type { Props }
export default StrToHtml
