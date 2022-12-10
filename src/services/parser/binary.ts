/**
 * Convert binary to number
 *
 * @param buffer binary data containing exactly `bytes` bytes
 * @param bytes how many bites of binary data are represented as one number
 * @returns numeric value if the buffer
 */
export const binaryToNumber = (buffer: Uint8Array, wordSize: '32-bit') => {
  if (wordSize === '32-bit') {
    if (buffer.buffer.byteLength !== 4) {
      throw new Error('binaryToNumber received binary input of wrong size (not 4B) for 32-bit word size')
    }

    const array = new Uint32Array(buffer.buffer)
    return array[0]
  }

  return 0
}

/**
 * Convert binary to text
 *
 * @param buffer binary data
 * @param encoding text encoding
 * @returns decoded text
 */
export const binaryToText = (buffer: ArrayBuffer, encoding: 'utf-8') => {
  if (encoding === 'utf-8') {
    return new TextDecoder().decode(new Uint8Array(buffer))
  }

  return ''
}
