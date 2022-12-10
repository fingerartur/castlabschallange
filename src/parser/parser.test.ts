import { parseIsobmff } from './parser'

describe('ISOBMFF parser', () => {
  it('can parse empty media file', () => {
    const result = parseIsobmff('')
    expect(result).toStrictEqual([])
  })

  it('can parse media file with 1 box', () => {
    const body1 = Array(24).fill(1).join('')
    // size 20, faak
    const hex = '000000146661616b' + body1

    const result = parseIsobmff(hex)

    expect(result).toStrictEqual([{
      position: 0,
      data: body1,
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

    const result = parseIsobmff(hex)

    expect(result).toStrictEqual([{
      position: 0,
      data: body1,
      size: 20,
      type: 'faak',
    },{
      position: 20,
      data: body2,
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

    const result = parseIsobmff(hex)

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
      data: '',
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

    const result = parseIsobmff(hex)

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
      data: '',
      size: 8,
      type: 'xoxo',
    }])
  })

  it('throw when media file is invalid', () => {
    expect(() => {
      parseIsobmff('hello')
    }).toThrow()
  })
})
