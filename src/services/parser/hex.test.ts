import { hexToNumber } from './hex'

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
})
