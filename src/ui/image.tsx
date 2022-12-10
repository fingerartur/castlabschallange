import { createDataUrl } from '../services/image/image'
import { Image } from '../services/image/types'

type Props = {
  image: Image
}

const styleImage = {
  maxWidth: 400,
  background: 'rgba(255,255,255,0.2)',
  margin: 3,
}

export const ImageUi = (props: Props) => {
  const { image } = props

  return <img
    src={createDataUrl(image)}
    alt=""
    style={styleImage}
  />
}
