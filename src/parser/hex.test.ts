import { arrayBufferToHexString } from './hex'

describe('hex', () => {
  describe('can convert array buffer to hex string', () => {
    it('simple values', () => {
      const buffer = new Uint8Array([1,2,3]).buffer
      const result = arrayBufferToHexString(buffer)

      expect(result).toBe('010203')
    })

    it('larger values', () => {
      const buffer = new Uint8Array([14,0,58,255]).buffer
      const result = arrayBufferToHexString(buffer)

      expect(result).toBe('0e003aff')
    })

    it('empty', () => {
      const buffer = new Uint8Array([]).buffer
      const result = arrayBufferToHexString(buffer)

      expect(result).toBe('')
    })
  })
})
