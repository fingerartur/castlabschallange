import { hexToBinary, hexToNumber, numberToHex } from './hex'

describe('hex', () => {
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

  describe('can convert number to hex', () => {
    it('simple', () => {
      expect(numberToHex(16)).toBe('10')

    })

    it('large', () => {
      expect(numberToHex(1048575)).toBe('fffff')
    })

    it('zero', () => {
      expect(numberToHex(0)).toBe('0')
    })
  })

  describe('can convert hex to binary', () => {
    it('simple', () => {
      expect(hexToBinary('10')).toStrictEqual(new Uint8Array([16]))
      expect(hexToBinary('aa')).toStrictEqual(new Uint8Array([170]))
    })

    it('large', () => {
      expect(hexToBinary('0fffff')).toStrictEqual(new Uint8Array([15, 255, 255]))
    })

    it('zero', () => {
      expect(hexToBinary('00')).toStrictEqual(new Uint8Array([0]))
    })
  })
})
