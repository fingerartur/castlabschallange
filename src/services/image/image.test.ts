/**
 * @jest-environment jsdom
 */

import { xml } from './fixtures/xml.js'
import { extractImagesFromXmlFiles } from './image'

describe('image', () => {
  describe('can parse out images from XML', () => {
    it('invalid XML', () => {
      const result = extractImagesFromXmlFiles(['invalid xml'])
      expect(result).toStrictEqual([])
    })

    it('xml with two images', () => {
      const result = extractImagesFromXmlFiles([xml])
      expect(result).toStrictEqual([{
        id:'image001',
        type: 'png',
        encoding: 'base64',
        dataUrl: 'data:image/png;base64,IMG1',
      },
      {
        id:'image002',
        type: 'png',
        encoding: 'base64',
        dataUrl: 'data:image/png;base64,IMG2',
      }])
    })
  })
})
