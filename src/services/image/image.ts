import { Image } from './types'

/**
 * Extract base64 images from XML. Assuming images are represented by `<smpte:image>` tags with
 * base64 data inside.
 *
 * If XML is invalid, returns empty array.
 */
const extractImagesFromXml = (xml: string): Image[] => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')

  // smpte:image xml:id="image001" imagetype="PNG" encoding="Base64"
  const images = Array.from(doc.getElementsByTagName('smpte:image'))
    .map(image => {
      const data = image.innerHTML.trim()
      const type = image.getAttribute('imagetype')?.toLocaleLowerCase()
      const encoding = image.getAttribute('encoding')?.toLocaleLowerCase()
      const id = image.getAttribute('xml:id') ?? ''

      if (data.length === 0 || encoding !== 'base64' || type == null) {
        return null
      }

      return {
        dataUrl: `data:image/${type};${encoding},${data}`,
        type,
        encoding,
        id,
      }
    })
    .filter(Boolean) as Image[]

  return images
}

/**
 * Extract base64 images from `<smpte:image>` tags from ISOBMFF boxes with XML content
 */
export const extractImagesFromXmlFiles = (xmlFiles: string[]) => {
  return xmlFiles.flatMap(file => {
    return extractImagesFromXml(file)
  })
}
