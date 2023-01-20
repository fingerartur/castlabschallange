import React from 'react'
import './app.css'

type Video = {
  uri: string
  /**
   * Use https://nickdesaulniers.github.io/mp4info/ to find out MIME
   */
  mime: string
  /**
   * Seconds
   */
  duration: number
  /**
   * Seconds
   */
  offset: number
}

const videos: Video[] = [
  {
    uri: 'video.mp4',
    mime: 'video/mp4; codecs="avc1.640020, mp4a.40.2"',
    duration: 10,
    offset: 0,
  },
  {
    uri: 'video3.mp4',
    mime: 'video/mp4; codecs="avc1.64001f, mp4a.40.2"',
    duration: 8,
    offset: 10,
  },
  {
    uri: 'video2.mp4',
    mime: 'video/mp4; codecs="avc1.64001f"',
    duration: 15,
    offset: 18,
  },
]

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

  play(video, videos)
}

let id = 0 

const play = (videoEl: HTMLVideoElement, videos: Video[]) => {
  videos.forEach(video => {
    if (!MediaSource.isTypeSupported(video.mime)) {
      throw new Error(`Unsupported MIME type or codec: ${video.mime}`)
    }
  })

  id ++
  
  const mediaSource = new MediaSource()
  console.info(`MediaSource ready state #${id} - initial`, mediaSource.readyState)

  console.info('Attaching MediaSource to video element src...')
  videoEl.src = URL.createObjectURL(mediaSource)

  mediaSource.addEventListener('sourceopen', () => console.info(`MediaSource #${id} ready state -> open`))
  mediaSource.addEventListener('sourceended', () => console.info(`MediaSource #${id} ready state -> ended`))
  mediaSource.addEventListener('sourceclose', () => console.info(`MediaSource #${id} ready state -> closed`))

  mediaSource.addEventListener('sourceopen', async () => {
    mediaSource.duration = videos.map(video => video.duration)
      .reduce((a, b) => a + b, 0)

    const dummyMime = 'video/mp4; codecs="avc1.640020, mp4a.40.2"'
    const sourceBuffer = mediaSource.addSourceBuffer(dummyMime)

    sourceBuffer.addEventListener('error', (error) => console.error('SourceBuffer error', error))
    sourceBuffer.addEventListener('abort', () => console.error('SourceBuffer abort'))

    for (let i = 0; i < videos.length; i++) {
      const video = videos[i]

      await loadMediaSourceData(sourceBuffer, video, () => {
        console.info('First buffer appended, playing video...')
        videoEl.play()
      })
    }

    mediaSource.endOfStream()
  })
}

const loadMediaSourceData = (sourceBuffer: SourceBuffer, video: Video, onFirstBuffer?: () => void) => {
  const CHUNK_COUNT = 3
  const CHUNK_TIMEOUT = 100

  return new Promise<void>(async resolve => {
    
    sourceBuffer.changeType(video.mime)
    sourceBuffer.timestampOffset = video.offset

    const binary = await fetchBinary(video.uri)
    const buffers = split(binary, CHUNK_COUNT)
    const bufferQueue = new BufferQueue(buffers)

    const onUpdateStart = () => {
      console.info('Buffer update started', bufferQueue.current?.order)
    }
    sourceBuffer.addEventListener('updatestart', onUpdateStart)

    const onUpdateEnd = () => {
      console.info('Buffer update ended', bufferQueue.current?.order)

      if (bufferQueue.current?.order === 1) {
        onFirstBuffer?.()
      }

      bufferQueue.next()
      const current = bufferQueue.current
      
      if (current) {
        setTimeout(() => {
          sourceBuffer.appendBuffer(current.buffer)
        }, CHUNK_TIMEOUT)
      } else {
        sourceBuffer.removeEventListener('updatestart', onUpdateStart)
        sourceBuffer.removeEventListener('updateend', onUpdateEnd)
        resolve()
      }
    }
    sourceBuffer.addEventListener('updateend', onUpdateEnd)
    
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
