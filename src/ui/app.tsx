import React from 'react'
import './app.css'

const MP4_URI = 'video.mp4'
// To find out the code use
// https://nickdesaulniers.github.io/mp4info/
const MIME_CODEC = 'video/mp4; codecs="avc1.640020, mp4a.40.2"'

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
    await loadMediaSourceData(mediaSource, uri, mimeCodec, () => {
      console.info('First buffer appended, playing video...')
      video.play()
    })
  })
}

/**
 * Load media source data as one request and append it to media source.
 * 
 * Resolves when media source has all the data of the video.
 */
const loadMediaSourceData = (mediaSource: MediaSource, uri: string, mimeCodec: string, onFirstBuffer: () => void) => {
  return new Promise<void>(async resolve => {
    const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)
    const binary = await fetchBinary(uri)
    const buffers = split(binary, 20)
    const bufferQueue = new BufferQueue(buffers)

    sourceBuffer.addEventListener('updatestart', () => {
      console.info('Buffer update started', bufferQueue.current?.order)
    })

    sourceBuffer.addEventListener('updateend', () => {
      console.info('Buffer update ended', bufferQueue.current?.order)

      if (bufferQueue.current?.order === 1) {
        onFirstBuffer()
      }

      bufferQueue.next()
      const current = bufferQueue.current
      
      if (current) {
        setTimeout(() => {
          sourceBuffer.appendBuffer(current.buffer)
        }, 1_000)
      } else {
        mediaSource.endOfStream()
        resolve()
      }
    })
    
    bufferQueue.next()
    if (bufferQueue.current) {
      sourceBuffer.appendBuffer(bufferQueue.current.buffer)
    }
  })
}

class BufferQueue {
  private buffers: DataView[]
  private order = 0
  private _current: {
    order: number,
    buffer: DataView,
  } | null = null

  get current() {
    return this._current
  }

  constructor(
    dataViews: DataView[],
  ) {
    this.buffers = dataViews
      .reverse()
  }

  isEmpty() {
    return this.buffers.length === 0
  }

  next() {
    if (this.isEmpty()) {
      this._current = null
      return
    }

    this.order ++
    this._current = {
      order: this.order,
      buffer: this.buffers.pop() as DataView,
    }
  }
}

const split = (arr: ArrayBuffer, count: number) => {
  const chunkBytes = Math.floor(arr.byteLength / count)
  const result: DataView[] = []

  console.info(`Original [0, ${arr.byteLength - 1}]`)

  for (let i = 0; i < count - 1; i++) {
    result.push(new DataView(arr, i * chunkBytes, chunkBytes))
    console.info(`Chunk #${i} = [${i * chunkBytes}, ${i * chunkBytes + chunkBytes -1}]`)
  }

  const lastChunkStartIndex = (count - 1) * chunkBytes
  const restBytes = arr.byteLength - lastChunkStartIndex
  result.push(new DataView(arr, lastChunkStartIndex, restBytes))
  
  console.info(`Chunk #${count-1} = [${lastChunkStartIndex}, ${lastChunkStartIndex + restBytes - 1}]`)

  return result
}

const fetchBinary = async (url: string) => {
  console.info('Fetching url', url)
  return await (await fetch(url)).arrayBuffer()
}
