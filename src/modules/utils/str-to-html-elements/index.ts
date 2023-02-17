import sanitize, { IOptions } from 'sanitize-html'

type Options = { sanitize?: IOptions }

export default function strToHtmlElements (dirtyStr: string, options?: Options): Element[] {
  const str = options?.sanitize !== undefined
    ? sanitize(dirtyStr, options.sanitize)
    : dirtyStr
  const wrapperDiv = document.createElement('div')
  wrapperDiv.innerHTML = str
  const elements = [...wrapperDiv.children]
  return elements
}
