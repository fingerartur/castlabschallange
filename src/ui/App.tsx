import './App.css'
import { Error } from './error'
import { useAnalyzeIsobmff } from './hooks'
import { ImageRow } from './imageRow'

const MP4_URI = 'http://demo.castlabs.com/tmp/text0.mp4'

/**
 * UI root
 */
export const App = () => {
  const uri = MP4_URI
  const { images, pending, error } = useAnalyzeIsobmff(uri)

  return (
    <div className="App">
      <main className="App-main">
        <h1>
          ISOBMFF Micro Parser (Cast Labs Challenge)
        </h1>
        <p>URI: {uri}</p>
        <p style={{ fontStyle: 'italic' }}>Open Developer Console to view info about this file.</p>

        <div style={{ width: '80%' }}>
          {error
            ? <Error error={error}/>
            : <ImageRow images={images} isLoading={pending}/>
          }
        </div>

        <div style={{ paddingTop: 50, fontSize: 20, marginBottom: 200 }}>
        Author <a href="https://www.linkedin.com/in/artur-finger-790111137/">Artur Finger</a>
        </div>
      </main>
    </div>
  )
}

