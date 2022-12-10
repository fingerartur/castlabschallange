/**
 * Convert binary to hex string representation of that data
 *
 * @param {ArrayBuffer} buffer - binary buffer
 * @returns {string} - hex string
 */
export const arrayBufferToHexString = (buffer: ArrayBuffer) => {
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
 * @param {string} hex - hex string value without 0x prefix, e.g. 0efa1
 * @return {number} - numeric value
 */
export const hexToNumber = (hex: string): number => {
  return Number(`0x${hex}`)
}

/**
 * Converts hex string to text
 *
 * @param {string} hex - hex string value without 0x prefix, e.g. 0efa1
 * @returns {string} - text
 */
export const stringFromHexCharCode = (hex: string): string => {
  const charCodes: number[] = []

  for (let i = 0; i < hex.length; i += 2) {
    const hexByte = hex.substring(i, i + 2)
    const charCode = hexToNumber(hexByte)
    charCodes.push(charCode)
  }

  return String.fromCharCode(...charCodes)
}
