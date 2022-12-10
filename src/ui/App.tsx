import { useEffect, useState } from 'react'
import { extractImagesFromXml } from '../services/image/image'
import { Image } from '../services/image/types'
import { filterMdat, printBoxData, printBoxes } from '../services/parser/box'
import { arrayBufferToHexString, stringFromHexCharCode } from '../services/parser/hex'
import { parseIsobmff } from '../services/parser/parser'
import './App.css'
import { ImageUi } from './image'

const MP4_URI = 'http://demo.castlabs.com/tmp/text0.mp4'

export const App = () => {
  const [images, setImages] = useState<Image[]>([])

  const uri = MP4_URI

  const process = async (uri: string) => {
    console.info('Processing uri', uri)

    const response = await fetch(uri, {
      method: 'GET',
    })

    const binary = await response.arrayBuffer()
    const hex = arrayBufferToHexString(binary)

    // console.info('Hex representation:', hex.substring(0, 1000))

    const boxes = parseIsobmff(hex)

    console.info('Media file:', uri)
    console.info('Media file structure:')
    printBoxes(boxes)
    console.info('')

    console.info('MDAT data boxes:')
    const mdatBoxes = filterMdat(boxes)
    printBoxData(mdatBoxes)
    console.info('')

    console.info('Debug:', boxes)

    return {
      boxes,
      mdatBoxes,
    }
  }

  useEffect(() => {
    process(uri).then(result => {
      const images = result.mdatBoxes
        .flatMap(box => {
          const xml = stringFromHexCharCode(box.data ?? '')
          return extractImagesFromXml(xml)
        })

      setImages(images)
    })
  }, [])

  return (
    <div className="App">
      <main className="App-main">
        <h1>
          ISOBMFF Micro Parser (Cast Labs Challenge)
        </h1>
        <p>URI: {uri}</p>
        <p style={{ fontStyle: 'italic' }}>Open Developer Console to view info about this file.</p>

        <div style={{ height: 300, overflow: 'hidden' }}>
          {images.map(image => <ImageUi key={image.id} image={image} />)}
        </div>

        <div style={{ paddingTop: 50, fontSize: 20 }}>
        Author <a href="https://www.linkedin.com/in/artur-finger-790111137/">Artur Finger</a>
        </div>
      </main>
    </div>
  )
}

