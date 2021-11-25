import { Component, JSX, createElement } from 'preact'

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
    if (props.content === undefined) return <></>
    
    const wrapper = document.createElement('div')
    wrapper.innerHTML = props.content
    const wrapperChildren = wrapper.children

    // No children
    if (wrapperChildren.length <= 0) return props.content

    // Single child
    if (wrapperChildren.length === 1) {
      const onlyChild = wrapperChildren[0]
      return createElement(
        onlyChild.tagName,
        { dangerouslySetInnerHTML: { __html: onlyChild.innerHTML } }
      )
    }

    // Multiple children
    return <span dangerouslySetInnerHTML={{ __html: props.content ?? '' }} />

  }
}

export type { Props }
export default StrToHtml
