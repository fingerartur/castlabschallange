/**
 * Convert binary to hex string representation of that data
 *
 * @param buffer binary buffer
 * @returns hex string
 */
export const binaryToHex = (buffer: ArrayBuffer) => {
  // Convert buffer of bits to array of unsigned integers
  // (each 8 bits are converted to one unsigned int)
  const integers = new Uint8Array(buffer)

  // Convert each unsigned int to hex
  let result = ''
  for (let i = 0; i < integers.length; i++) {
    result += integers[i].toString(16).padStart(2, '0')
  }

  return result
}

/**
 * Convert a hex string value to the number which is represented by this hex string
 *
 * @param hex hex string value without 0x prefix, e.g. 0efa1
 * @return numeric value
 */
export const hexToNumber = (hex: string): number => {
  return Number(`0x${hex}`)
}

/**
 * Converts hex string to text, assuming hex string contains
 * UTF-8-encoded textual data
 *
 * @param hex hex string value without 0x prefix, e.g. 0efa1
 * @returns text
 */
export const hexToText = (hex: string): string => {
  const codePoints: number[] = []

  for (let i = 0; i < hex.length; i += 2) {
    const hexByte = hex.substring(i, i + 2)
    const utf8CodePoint = hexToNumber(hexByte)
    codePoints.push(utf8CodePoint)
  }

  return String.fromCodePoint(...codePoints)
}
