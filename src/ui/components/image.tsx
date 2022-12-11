type Props = {
  uri: string
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
  overflow: 'hidden',
  backgroundSize: 'cover',
  backgroundImage: 'url("https://media.npr.org/assets/img/2016/09/01/narcos_203_00873r1_wide-775f1c1b8a3fe57cb17da8361e5e1c165e90d12f-s1600-c85.webp")',
}

const styleImage = {
  position: 'absolute' as any,
  width: '100%',
  left: 0,
  top: 0,
  // background: 'rgba(255,255,255,0.05)',
}

/**
 * Image with a background
 */
export const ImageUi = (props: Props) => {
  const { uri } = props

  return (
    <div style={styleContainer}>
      <div style={styleBg} />
      <img
        src={uri}
        alt=""
        style={styleImage}
      />
    </div>
  )
}
