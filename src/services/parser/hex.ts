/**
 * Convert a hex string value to the number which is represented by this hex string
 *
 * @param hex hex value without 0x prefix, e.g. 0efa1
 * @return numeric value
 */
export const hexToNumber = (hex: string): number => {
  return Number(`0x${hex}`)
}

/**
 * Convert hex value to binary
 *
 * @param hex hex value without 0x prefix, e.g. 0efa1
 * @returns binary value (big endian format) e.g. 0fffff ->
 *
 * @example
 * hexToBinary('0fffff') // returns new Uint8Array([15, 255, 255])
 */
export const hexToBinary = (hex: string): Uint8Array => {
  if (hex.length % 2 !== 0) {
    throw new Error('hexToBinary input does not have even length')
  }

  const values = []

  for (let i = 0; i < hex.length; i+=2) {
    const hexByte = hex.substring(i, i+2)
    values.push(hexToNumber(hexByte))
  }

  return new Uint8Array(values)
}

/**
 * Convert number to hex
 * @param num number
 * @returns hex (without 0x prefix ... e.g. a1)
 */
export const numberToHex = (num: number): string => {
  return Number(num).toString(16)
}
