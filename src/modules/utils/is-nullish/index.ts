function isNullish (val: any): boolean {
  const nullishValues = [0, '', false, null, undefined]
  return nullishValues.includes(val)
}

export default isNullish
