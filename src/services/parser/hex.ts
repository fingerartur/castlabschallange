/**
 * Convert a hex string value to the number which is represented by this hex string
 *
 * @param hex hex string value without 0x prefix, e.g. 0efa1
 * @return numeric value
 */
export const hexToNumber = (hex: string): number => {
  return Number(`0x${hex}`)
}

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
