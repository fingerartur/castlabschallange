import { stringFromHexCharCode } from './hex'

/**
 * Box is a basic building block of ISOBMFF media file
 *
 * [[ 4B size ][ 4B type ][ ... data ...]]
 */
export type Box = {
  /**
   * Box data as hex string
   *
   * Only Leaf box can have data
   */
  data?: string
  /**
   * Size in bytes that the box takes up (data + 8B header)
   *
   * Size info is stored in the first 4 bytes of the header
   */
  size: number
  /**
   * Index of the byte in binary file where this box starts, starting at 0.
   */
  position: number
  /**
   * Box type as a string (binary converted to string via char codes)
   *
   * Type info is stored in the second 4 bytes of the header
   */
  type: string
  /**
   * Child boxes
   *
   * Only Node box can have children
   */
  children?: Box[]
}

enum BoxType {
  MDAT = 'mdat',
  MOOF = 'moof',
  TRAF = 'traf',
}

/**
 * Checks if box is "node" aka has children
 */
export const isNodeBox = (box: Box) => {
  return [BoxType.MOOF, BoxType.TRAF].includes(box.type as BoxType)
}

/**
 * Prints boxes to console
 */
export const printBoxes = (boxes: Box[]) => {
  console.info(toStringBoxes(boxes))
}

export const toStringBoxes = (boxes: Box[], indent = '') => {
  const result = boxes.map(box => {
    const prefix = indent.length > 0 ? `${indent}-` : ''

    let info = `${prefix}[${box.size} B, ${box.type}]`

    if (box.children) {
      info = info + '\n' + toStringBoxes(box.children, indent + '   ')
    }

    return info
  }).join('\n')

  return result
}

/**
 * Filter out only MDAT boxes
 */
export const filterMdat = (boxes: Box[]): Box[] => {
  const result: Box[] = []

  boxes.forEach(box => {
    if (box.type === BoxType.MDAT) {
      result.push(box)
    } else if (box.children) {
      const childMdats = filterMdat(box.children)
      result.push(...childMdats)
    }
  })

  return result
}

export const printMdatBoxes = (boxes: Box[]) => {
  const mdat = filterMdat(boxes)

  const text = mdat.map(box => {
    const data = box.data ? stringFromHexCharCode(box.data) : ''
    return `${box.type}, byte index: ${box.position}, size: ${box.size} B\n\n${data}`
  }).join('\n')

  console.info(text)
}
