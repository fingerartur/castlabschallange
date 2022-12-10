import { Image } from './types'

export const extractImagesFromXml = (xml: string): Image[] => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')

  // smpte:image xml:id="image001" imagetype="PNG" encoding="Base64"
  const images = Array.from(doc.getElementsByTagName('smpte:image'))
    .map(image => {
      return {
        data: image.innerHTML.trim(),
        type: (image.getAttribute('imagetype') ?? '').toLowerCase(),
        encoding: (image.getAttribute('encoding') ?? '').toLocaleLowerCase(),
        id: image.getAttribute('xml:id') ?? '',
      }
    })
    .filter(image => image.encoding === 'base64' && image.data.length > 0) as Image[]

  return images
}

export const createDataUrl = (image: Image): string => {
  return `data:image/${image.type};${image.encoding},${image.data}`
}
