import React from 'react'
import { Image } from '../services/image/types'
import { ImageUi } from './image'
import { styleCentered } from './style'

type Props = {
  images: Image[]
  isLoading: boolean
}

const styleLoading = {
  ...styleCentered,
  height: 300,
}

/**
 * A row of images
 */
export const ImageRow = React.memo((props: Props) => {
  const { images, isLoading } = props

  if (isLoading) {
    return (<div style={styleLoading}>Loading...</div>)
  }

  return (
    <>
      {images.map(image => <ImageUi key={image.id} image={image} />)}
    </>
  )
})
