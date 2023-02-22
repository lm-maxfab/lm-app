import { VNode, createElement } from 'preact'

export default function nodesToVNodes (inputNodes: Node|Node[]): VNode[] {
  const nodes = Array.isArray(inputNodes) ? inputNodes : [inputNodes]
  const vNodes = nodes.map(node => nodeToVNode(node))
  return vNodes
}

function nodeToVNode (node: Node): VNode {
  const { nodeType } = node
  if (nodeType === Node.ELEMENT_NODE) return elementToVNode(node as Element)
  if (nodeType === Node.TEXT_NODE) return <>{(node as Text).wholeText}</>
  return <></>
}

function elementToVNode (element: Element): VNode {
  const { tagName, attributes, childNodes } = element
  const attributesNameVal: { [key: string]: string } = [...attributes].reduce((acc, curr) => {
    return {
      ...acc,
      [curr.name]: curr.value
    }
  }, {})
  const vNode = createElement(
    tagName.toLowerCase(),
    { ...attributesNameVal },
    [...childNodes].map(node => nodeToVNode(node))
  )
  return vNode
}
