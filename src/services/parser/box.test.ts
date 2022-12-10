import { Box, filterMdat } from './box'

describe('box', () => {
  describe('can filter mdat boxes', () => {
    it('zero mdat boxes', () => {
      const boxes: Box[] = [{
        position: 0,
        size: 100,
        type: 'moof',
        children: [
          {
            position: 8,
            size: 92,
            type: 'xoxo',
          },
        ],
      },{
        position: 100,
        data: new Uint8Array(),
        size: 8,
        type: 'boxo',
      }]

      const mdats = filterMdat(boxes)
      expect(mdats).toStrictEqual([])
    })

    it('two mdat boxes', () => {
      const boxes: Box[] = [{
        position: 0,
        size: 100,
        type: 'moof',
        children: [
          {
            position: 8,
            size: 46,
            type: 'xoxo',
          },
          {
            position: 54,
            size: 46,
            type: 'mdat',
            data: new Uint8Array(Array(38).fill(1)),
          },
        ],
      },{
        position: 100,
        data: new Uint8Array(),
        size: 8,
        type: 'mdat',
      }]

      const mdats = filterMdat(boxes)

      expect(mdats).toStrictEqual([
        {
          position: 54,
          size: 46,
          type: 'mdat',
          data: new Uint8Array(Array(38).fill(1)),
        },{
          position: 100,
          data: new Uint8Array(),
          size: 8,
          type: 'mdat',
        },
      ])
    })

  })
})
