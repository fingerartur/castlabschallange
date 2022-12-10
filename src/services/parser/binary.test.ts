import { binaryToNumber, binaryToText } from './binary'

describe('binary', () => {
  describe('can convert binary to number', () => {
    it('zero', () => {
      expect(binaryToNumber(new Uint8Array([0,0,0,0]), '32-bit')).toBe(0)
    })

    it('small', () => {
      expect(binaryToNumber(new Uint8Array([7,0,0,0]), '32-bit')).toBe(7)
    })

    it('large 32-bit', () => {
      expect(binaryToNumber(new Uint8Array([200,200,200,200]), '32-bit')).toBe(3368601800)
    })
  })

  describe('can convert binary to text utf-8', () => {
    it('normal', () => {
      const binary = new Uint8Array([104, 101, 108, 108, 111, 32, 116, 104, 101, 114, 101, 32, 103, 101, 110, 101, 114, 97, 108, 32, 107, 101, 110, 111, 98, 105])
      expect(binaryToText(binary, 'utf-8')).toBe('hello there general kenobi')
    })

    it('empty', () => {
      expect(binaryToText(new Uint8Array([]), 'utf-8')).toBe('')
    })
  })
})
