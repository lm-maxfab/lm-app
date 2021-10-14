export default function getHeaderElement (): HTMLElement|undefined {
  const possibleNavs = Array.from(
    document.querySelectorAll('header#Header, header.multimediaNav')
  ) as HTMLElement[]
  if (possibleNavs.length === 0) return
  return possibleNavs[0]
}
