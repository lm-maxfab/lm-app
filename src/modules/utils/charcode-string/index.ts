function charToCode36 (char: string) {
  if (char.length !== 1) {
    console.error('input char length must be of one')
    return
  }
  const charCode = char.charCodeAt(0)
  if (!Number.isInteger(charCode)) {
    console.error(`Input ${char} charCode is not an integer: ${charCode}`)
    return
  }
  return charCode.toString(36)
}

function code36ToChar (code36: string) {
  const code = parseInt(code36, 36)
  if (!Number.isInteger(code)) {
    console.error(`Input ${code36} parsing did not return an integer: ${code}`)
    return
  }
  return String.fromCharCode(code)
}

export function toCharcodes36 (str: string) {
  return str
    .split('')
    .map(charToCode36)
    .join(',')
}

export function toString (charCodes: string) {
  return charCodes
    .split(',')
    .map(code36ToChar)
    .join('')
}
