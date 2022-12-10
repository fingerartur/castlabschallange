import { binaryToHex, hexToNumber, hexToText } from './hex'

describe('hex', () => {
  describe('can convert array buffer to hex string', () => {
    it('simple values', () => {
      const buffer = new Uint8Array([1,2,3]).buffer
      const result = binaryToHex(buffer)

      expect(result).toBe('010203')
    })

    it('larger values', () => {
      const buffer = new Uint8Array([14,0,58,255]).buffer
      const result = binaryToHex(buffer)

      expect(result).toBe('0e003aff')
    })

    it('empty', () => {
      const buffer = new Uint8Array([]).buffer
      const result = binaryToHex(buffer)

      expect(result).toBe('')
    })
  })

  describe('can convert hex to number', () => {
    it('simple', () => {
      expect(hexToNumber('10')).toBe(16)
      expect(hexToNumber('aa')).toBe(170)
      expect(hexToNumber('00')).toBe(0)
    })

    it('large', () => {
      expect(hexToNumber('fffff')).toBe(1048575)
    })

    it('zero', () => {
      expect(hexToNumber('00')).toBe(0)
    })

    it('returns NaN for wrong input', () => {
      expect(hexToNumber('cat')).toBe(NaN)
      expect(hexToNumber('0x22')).toBe(NaN)
    })
  })

  describe('can convert hex to text', () => {
    it('short', () => {
      expect(hexToText('214142')).toBe('!AB')
    })

    it('long', () => {
      const result = hexToText('68656c6c6f2074686572652067656e6572616c206b656e6f6269')
      expect(result).toBe('hello there general kenobi')
    })

    it('empty', () => {
      expect(hexToText('')).toBe('')
    })

  })
})
