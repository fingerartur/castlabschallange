import { useEffect } from 'react'
import './App.css'
import { arrayBufferToHexString } from './parser/hex'

const MP4_URI = 'http://demo.castlabs.com/tmp/text0.mp4'

export const App = () => {
  const uri = MP4_URI

  const process = async (uri: string) => {
    console.info('Processing uri', uri)

    const response = await fetch(uri, {
      method: 'GET',
    })

    const binary = await response.arrayBuffer()
    const hex = arrayBufferToHexString(binary)

    console.info('Hex representation:', hex.substring(0, 1000))
  }

  useEffect(() => {
    process(uri)
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>
        ISOBMFF Micro Parser (Cast Labs Challenge)
        </h1>
        <p>URI: {uri}</p>
        <p style={{ fontStyle: 'italic' }}>Open Developer Console to view info about this file.</p>
      </header>
    </div>
  )
}
