import { binaryToNumber, binaryToText } from './binary'
import { Box, isNodeBox } from './box'

/**
 * Size of one box header item in bytes
 */
const BOX_HEADER_ITEM_BYTE_SIZE = 4
/**
 * Size of the whole box header in bytes
 */
const BOX_HEADER_BYTE_SIZE = BOX_HEADER_ITEM_BYTE_SIZE * 2

type Interval = {
  start: number
  end: number
  size: number
}

/**
 * Closed interval [start, end]
 * (both start and end indices are included)
 */
const interval = (index: number, size: number): Interval => {
  return {
    start: index,
    end: index + size - 1,
    size,
  }
}

/**
 * Copy a slice of binary data
 *
 * @param binary
 * @param interval
 * @returns slice of binary data in interval (including start and end)
 */
const copy = (binary: Uint8Array, interval: Interval): Uint8Array => {
  return binary.slice(interval.start, interval.end + 1)
}

/**
 * Read item from box header as binary
 *
 * @param hex media file
 * @param index where the item starts
 * @returns 4 bytes of binary
 */
const readBoxHeaderItem = (binary: Uint8Array, index: number): Uint8Array => {
  const itemInterval = interval(index, BOX_HEADER_ITEM_BYTE_SIZE)

  if (itemInterval.end >= binary.length) {
    throw new Error('Invalid media file: File contains unfinished box header')
  }

  return copy(binary, itemInterval)
}

/**
 * Read box size
 *
 * @param binary media file
 * @param index where the box starts in medial file
 */
const readBoxSize = (binary: Uint8Array, index: number): number => {
  const item = readBoxHeaderItem(binary, index)
  return binaryToNumber(item.reverse(), '32-bit')
}

/**
 * Read box type
 *
 * @param binary media file
 * @param index where the box starts in medial file
 */
const readBoxType = (binary: Uint8Array, index: number) => {
  const item = readBoxHeaderItem(binary, index + BOX_HEADER_ITEM_BYTE_SIZE)
  return binaryToText(item, 'utf-8')
}

/**
 * Read box body
 *
 * @param binary media file
 * @param index where the box starts in hex file
 * @param byteSize size of the box in bytes
 */
const readBoxBody = (binary: Uint8Array, index: number, byteSize: number): Uint8Array => {
  if (byteSize < BOX_HEADER_BYTE_SIZE) {
    throw new Error('Invalid media file: Box size is too small')
  } else if (byteSize === BOX_HEADER_BYTE_SIZE) {
    return new Uint8Array()
  }

  const startIndex = index + BOX_HEADER_BYTE_SIZE
  const bodyInterval = interval(startIndex, byteSize - BOX_HEADER_BYTE_SIZE)

  return copy(binary, bodyInterval)
}

/**
 * Parse ISOBMFF file
 *
 * https://en.wikipedia.org/wiki/ISO_base_media_file_format#File_type_box
 *
 * @param {string} hex hex string representation of ISOBMFF media file data
 * @returns {Box[]} structure of the ISOBMFF file (array of boxes with optional nested boxes)
 */
export const parseIsobmff = (binary: Uint8Array): Box[] => {
  const boxes: Box[] = []
  /**
   * Index in binary data
   */
  let index = 0

  while (index < binary.length) {
    const size = readBoxSize(binary, index)
    const type = readBoxType(binary, index)

    const box: Box = {
      position: index,
      size,
      type,
    }

    // TODO memory optimization, do not copy data?
    const data = readBoxBody(binary, index, size)
    if (isNodeBox(box)) {
      box.children = parseIsobmff(data)
    } else {
      box.data = data
    }

    boxes.push(box)

    index += box.size
  }

  return boxes
}
