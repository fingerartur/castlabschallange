import React from 'react'
import './app.css'

const MP4_URI = 'video3.mp4'
const MIME_CODEC = 'video/mp4; codecs="avc1.64001e"; profiles="isom,iso6,iso2,avc1,mp41"'

/**
 * UI root
 */
export const App = React.memo(() => {
  return (
    <div className="App">
      <main className="App-main">
        <h1>
          ISOBMFF Micro Parser (Cast Labs Challenge)
        </h1>
        <button onClick={run}>RUN</button>
        <video autoPlay style={{ width: 300, border: '1px solid black' }} controls/>
      </main>
    </div>
  )
})

const run = () => {
  const video = document.querySelector('video')

  if (video == null) {
    return
  }

  play(video, MP4_URI, MIME_CODEC)
}

let id = 0 

const play = (video: HTMLVideoElement, uri: string, mimeCodec: string) => {
  if (!MediaSource.isTypeSupported(mimeCodec)) {
    console.error('Unsupported MIME type or codec: ', mimeCodec)
    return
  }

  id ++
  
  const mediaSource = new MediaSource()
  console.info(`MediaSource ready state #${id} - initial`, mediaSource.readyState)

  console.info('Attaching MediaSource to video element src...')
  video.src = URL.createObjectURL(mediaSource)

  mediaSource.addEventListener('sourceopen', () => console.info(`MediaSource #${id} ready state -> open`))
  mediaSource.addEventListener('sourceended',  () => console.info(`MediaSource #${id} ready state -> ended`))
  mediaSource.addEventListener('sourceclose',  () => console.info(`MediaSource #${id} ready state -> closed`))

  mediaSource.addEventListener('sourceopen', async () => {
    await loadMediaSourceData(mediaSource, uri, mimeCodec)
    video.play()
  })
}

/**
 * Load media source data as one request and append it to media source.
 * 
 * Resolves when media source has all the data of the video.
 */
const loadMediaSourceData = (mediaSource: MediaSource, uri: string, mimeCodec: string) => {
  return new Promise<void>(async resolve => {
    const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)

    sourceBuffer.addEventListener('updateend', () => {
      mediaSource.endOfStream()
      resolve()
    })
    
    const binary = await fetchBinary(uri)
    sourceBuffer.appendBuffer(binary)
  })
}

const fetchBinary = async (url: string) => {
  console.info('Fetching url', url)
  return await (await fetch(url)).arrayBuffer()
}
