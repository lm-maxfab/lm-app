async function fetchTsvBase (url: string): Promise<string> {
  const response = await window.fetch(url)
  if (response.ok === false) throw new Error()
  const tsvBase = await response.text()
  return tsvBase
}

export default fetchTsvBase
