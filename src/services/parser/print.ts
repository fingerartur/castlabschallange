import { binaryToText } from './binary'
import { Box, toStringBoxes } from './box'

/**
 * Print media file box structure and content of it's MDAT boxes
 */
export const printInfo = (uri: string, boxes: Box[], mdatBoxes: Box[]) => {
  console.info('Media file:', uri)
  console.info('Media file structure:')
  printBoxes(boxes)
  console.info('')

  console.info('MDAT box data:')
  printBoxData(mdatBoxes)
  console.info('')

  console.info('Debug:', boxes)
}

/**
 * Prints boxes to console (including children)
 */
const printBoxes = (boxes: Box[]) => {
  console.info(toStringBoxes(boxes))
}

/**
 * Print box data to console interpreted as text
 */
const printBoxData = (boxes: Box[]) => {
  const text = boxes.map(box => {
    const data = box.data ? binaryToText(box.data, 'utf-8') : ''

    return `${box.type}, byte index: ${box.position}, size: ${box.size} B\n\n${data}`
  }).join('\n')

  console.info(text)
}
