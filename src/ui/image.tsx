import { Image } from '../services/image/types'

type Props = {
  image: Image
}

const styleContainer = {
  display: 'inline-block',
  position: 'relative' as any,
  width: '400px',
  height: '300px',
  margin: 3,
}

const styleBg = {
  position: 'absolute' as any,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  opacity: 0.4,
  overflow: 'hidden',
  backgroundSize: 'cover',
  backgroundImage: 'url("https://media.npr.org/assets/img/2016/09/01/narcos_203_00873r1_wide-775f1c1b8a3fe57cb17da8361e5e1c165e90d12f-s1600-c85.webp")',
}

const styleImage = {
  width: '100%',
  // background: 'rgba(255,255,255,0.05)',
}

/**
 * Image with a background
 */
export const ImageUi = (props: Props) => {
  const { image } = props

  return (
    <div style={styleContainer}>
      <div style={styleBg} />
      <img
        src={image.dataUrl}
        alt=""
        style={styleImage}
      />
    </div>
  )
}
