import { binaryToText } from './binary'

/**
 * Box is a basic building block of ISOBMFF media file. First 8 bytes form the header with
 * size and type metadata, the rest is payload. Payload can contain either other boxes
 * or binary data, depending on box type.
 *
 * [[ 4B size ][ 4B type ][ ... data ...]]
 */
export type Box = {
  /**
   * Binary box data
   *
   * Only Leaf box can have data
   */
  data?: Uint8Array
  /**
   * Size in bytes that the box takes up (data + 8B header)
   *
   * Size info is stored in the first 4 bytes of the header
   */
  size: number
  /**
   * Index of the byte in binary file where this box starts, starting at 0
   */
  position: number
  /**
   * Box type as a string (binary converted to string via UTF-8)
   *
   * Type info is stored in the second 4 bytes of the header
   */
  type: string
  /**
   * Child boxes
   *
   * Only Node boxes can have children
   */
  children?: Box[]
}

/**
 * Box types
 *
 * There are more box types, this is just a few of them
 */
enum BoxType {
  MDAT = 'mdat',
  MOOF = 'moof',
  TRAF = 'traf',
}

/**
 * Checks if box is "node" i.e. has children
 */
export const isNodeBox = (box: Box) => {
  return [BoxType.MOOF, BoxType.TRAF].includes(box.type as BoxType)
}

/**
 * Check if box should contain data
 */
export const isDataBox = (box: Box) => {
  return [BoxType.MDAT].includes(box.type as BoxType)
}

/**
 * Recursively convert boxes to string (for overview purposes)
 */
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
 * @returns MDAT boxes
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

/**
 * @returns box data converted to text
 */
export const boxDataToText = (boxes: Box[]): string[] => {
  const texts = boxes.map(box => {
    return box.data ? binaryToText(box.data, 'utf-8') : ''
  })

  return texts
}
