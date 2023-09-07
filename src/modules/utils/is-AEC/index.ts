export default function isAEC (): boolean {
  let isAEC = false
  const urlMatch = window.location.href.match(/apps.([a-z]+\-)?lemonde.(fr|io)/)
  if (urlMatch != null && urlMatch.length > 0) isAEC = true
  if ((window as any)?.lmd?.isAec === true) isAEC = true
  return isAEC
}
