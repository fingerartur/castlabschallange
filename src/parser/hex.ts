/**
 * Convert binary to hex string representation of that data
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

