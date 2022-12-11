import { binaryToText } from './binary'
import { Box, toStringBoxes } from './box'

/**
 * Print media file box structure and content of it's MDAT boxes
 */
export const printInfo = (uri: string, boxes: Box[], mdatBoxes: Box[]) => {
  console.info('Media file:', uri)
  printBoxes(boxes)
  printBoxData(mdatBoxes)
  console.info('Debug:', boxes)
}

/**
 * Prints boxes to console (including children)
 */
const printBoxes = (boxes: Box[]) => {
  console.info('Media file structure:\n\n' + toStringBoxes(boxes))
}

/**
 * Print box data to console interpreted as text
 */
const printBoxData = (boxes: Box[]) => {
  const text = boxes.map(box => {
    const data = box.data ? binaryToText(box.data, 'utf-8') : ''

    return `Box type: ${box.type}, byte index: ${box.position}, size: ${box.size} B, Content:\n\n${data}`
  }).join('\n')

  console.info(text)
}
