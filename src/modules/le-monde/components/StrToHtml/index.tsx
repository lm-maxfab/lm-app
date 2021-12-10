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
    if (props.content === undefined || props.content === '') return <></>

    const wrapper = document.createElement('div')
    wrapper.innerHTML = props.content as string
    const wrapperNodes = [...wrapper.childNodes].filter((node: ChildNode) => {
      const { nodeType } = node
      const possibleNames = [1, 3] // ['ELEMENT_NODE', 'TEXT_NODE']
      return possibleNames.includes(nodeType)
    })

    // No children (a not really possible case)
    if (wrapperNodes.length <= 0) return <></>

    // Single child
    if (wrapperNodes.length === 1) {
      const onlyChild = wrapperNodes[0]
      if (onlyChild.nodeType === 3) return props.content // `nodeType === 3` means TEXT_NODE
      const onlyChildAsElement = onlyChild as Element
      const attrs: any = {}
      for (let lol of onlyChildAsElement.attributes) attrs[lol.name] = lol.value
      return createElement(
        onlyChildAsElement.tagName,
        { ...attrs, dangerouslySetInnerHTML: { __html: onlyChildAsElement.innerHTML } }
      )
    }

    // Multiple children
    return <span dangerouslySetInnerHTML={{ __html: props.content ?? '' }} />

  }
}

export type { Props }
export default StrToHtml
