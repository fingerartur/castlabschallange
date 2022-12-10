import { useEffect, useState } from 'react'
import { extractImagesFromXmlFiles } from '../services/image/image'
import { Image } from '../services/image/types'
import { boxDataToText, filterMdat } from '../services/parser/box'
import { fetchBinary } from '../services/parser/loader'
import { parseIsobmff } from '../services/parser/parser'
import { printInfo } from '../services/parser/print'

/**
 * Analyze media file, print info to console and return
 * any base64-encoded images found in MDAT boxes
 */
export const useAnalyzeIsobmff = (uri: string) => {
  const [images, setImages] = useState<Image[]>([])
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string|null>(null)

  const fetchFile = async (uri: string ) => {
    try {
      return await fetchBinary(uri)
    } catch (error) {
      setError('Failed to fetch media file')
      throw error
    }
  }

  const process = async (uri: string) => {
    if (pending) {
      return
    }

    setPending(true)

    console.info('Processing uri', uri)

    const binary = await fetchFile(uri)

    const boxes = parseIsobmff(binary)
    const mdatBoxes = filterMdat(boxes)

    printInfo(uri, boxes, mdatBoxes)

    const xmlFiles = boxDataToText(mdatBoxes)
    const images = extractImagesFromXmlFiles(xmlFiles)

    setImages(images)
    setPending(false)
  }

  useEffect(() => {
    process(uri)
  }, [uri])

  return {
    images,
    pending,
    error,
  }
}
