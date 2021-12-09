function isValidClassName (string: string) {
  const regex = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/
  return regex.test(string)
}

export default isValidClassName
