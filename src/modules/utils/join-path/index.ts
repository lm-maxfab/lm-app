export function joinPath (...segments: string[]) {
  const parts = segments.reduce((parts: string[], segment) => {
    if (parts.length > 0) { segment = segment.replace(/^\//, '') }
    segment = segment.replace(/\/$/, '')
    return parts.concat(segment.split('/'))
  }, [])
  const resultParts = []
  for (const part of parts) {
    if (part === '.') continue
    if (part === '..') {
      resultParts.pop()
      continue
    }
    resultParts.push(part)
  }
  return resultParts.join('/')
}
