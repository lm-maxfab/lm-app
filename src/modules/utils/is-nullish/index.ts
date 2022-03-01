function isNullish (val: any) {
  const nullishValues = [0, '', false, null, undefined]
  return nullishValues.indexOf(val) !== -1
}

export default isNullish
