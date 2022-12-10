import { hexToBinary, numberToHex } from './hex'
import { parseIsobmff } from './parser'

/**
 * Generated media file of nested MOOF boxes, ending with XOXO box
 * @param levels how many levels of nesting
 */
const generatedNestedMediaFile = (levels: number) => {
  const codeXoxo = '786f786f'
  const codeMoof = '6d6f6f66'
  let hex = `00000008${codeXoxo}`

  for (let i = 0; i < levels - 1; i++) {
    const size = hex.length / 2 + 8
    hex = `${numberToHex(size).padStart(8, '0')}${codeMoof}${hex}`
  }

  return hex
}

describe('ISOBMFF parser', () => {
  it('can parse empty media file', () => {
    const result = parseIsobmff(new Uint8Array())
    expect(result).toStrictEqual([])
  })

  it('can parse media file with 1 box', () => {
    const body1 = Array(24).fill(1).join('')
    // size 20, faak
    const binary = hexToBinary('000000146661616b' + body1)

    const result = parseIsobmff(binary)

    expect(result).toStrictEqual([{
      position: 0,
      data: hexToBinary(body1),
      size: 20,
      type: 'faak',
    }])
  })

  it('can parse media file with 2 boxes', () => {
    const body1 = Array(24).fill(1).join('')
    const body2 = Array(4).fill(1).join('')
    // size 20, faak
    const hex = '000000146661616b' + body1
      // size 10, lolo
      + '0000000a6c6f6c6f' + body2

    const binary = hexToBinary(hex)
    const result = parseIsobmff(binary)

    expect(result).toStrictEqual([{
      position: 0,
      data: hexToBinary(body1),
      size: 20,
      type: 'faak',
    },{
      position: 20,
      data: hexToBinary(body2),
      size: 10,
      type: 'lolo',
    }])
  })

  it('can parse media file with nested boxes (1 level)', () => {
    const codeXoxo = '786f786f'
    const codeMoof = '6d6f6f66'
    const halfBody = Array(76).fill(1).join('')

    // size 100 B [100B, moof, [46B, xoxo, ...], [46B, xoxo, ...]]
    const hex = `00000064${codeMoof}0000002e${codeXoxo}${halfBody}0000002e${codeXoxo}${halfBody}`
      // size 8, xoxo
      + `00000008${codeXoxo}`


    const binary = hexToBinary(hex)
    const result = parseIsobmff(binary)

    expect(result).toMatchObject([{
      size: 100,
      type: 'moof',
      children: [
        {
          size: 46,
          type: 'xoxo',
        },
        {
          size: 46,
          type: 'xoxo',
        },
      ],
    },{
      data: new Uint8Array(),
      size: 8,
      type: 'xoxo',
    }])
  })

  it('can parse media file with nested boxes (2 levels)', () => {
    const codeXoxo = '786f786f'
    const codeGood = '676f6f64'
    const codeMoof = '6d6f6f66'
    const codeTraf = '74726166'

    const bodyGood = Array(60).fill(1).join('')

    // [38 B, good, ...]
    const level2Box = `00000026${codeGood}${bodyGood}`
    // [46 B, traf, 1x good box]
    const level1Box = `0000002e${codeTraf}${level2Box}`
    // [100 B, moof, 2x traf box]
    const hex = `00000064${codeMoof}${level1Box}${level1Box}`
      // [8 B, xoxo, empty]
      + `00000008${codeXoxo}`

    const binary = hexToBinary(hex)
    const result = parseIsobmff(binary)

    expect(result).toMatchObject([{
      size: 100,
      type: 'moof',
      children: [
        {
          size: 46,
          type: 'traf',
          children: [{
            size: 38,
            type: 'good',
          }],
        },
        {
          size: 46,
          type: 'traf',
          children: [{
            size: 38,
            type: 'good',
          }],
        },
      ],
    },{
      data: new Uint8Array(),
      size: 8,
      type: 'xoxo',
    }])
  })

  it('throws when nesting is too deep', () => {
    expect(() => {
      const hex = generatedNestedMediaFile(1010)
      const binary = hexToBinary(hex)
      parseIsobmff(binary)
    }).toThrow('Media file has too deeply nested boxes - more than 1000 levels')
  })

  it('throw when media file is invalid', () => {
    expect(() => {
      parseIsobmff(new Uint8Array([7,6]))
    }).toThrow()
  })
})
