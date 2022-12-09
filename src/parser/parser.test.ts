import { parseIsobmff } from './parser'

describe('ISOBMFF parser', () => {
  it('can parse empty media file', () => {
    const result = parseIsobmff('')
    expect(result).toStrictEqual([])
  })

  it('can parse media file with 2 boxes', () => {
    const body1 = Array(24).fill(1).join('')
    const body2 = Array(4).fill(1).join('')
    // size 20, faak
    const hex = '000000146661616b' + body1
      // size 10, lolo
      + '0000000a6c6f6c6f' + body2

    const result = parseIsobmff(hex)

    expect(result).toStrictEqual([{
      data: body1,
      size: 20,
      type: 'faak',
      typeHex: '6661616b',
    },{
      data: body2,
      size: 10,
      type: 'lolo',
      typeHex: '6c6f6c6f',
    }])
  })

  it('throw when media file is invalid', () => {
    expect(() => {
      parseIsobmff('hello')
    }).toThrow()
  })
})
