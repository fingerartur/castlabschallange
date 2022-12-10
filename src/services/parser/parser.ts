import { Box, isNodeBox } from './box'
import { hexToNumber, hexToText } from './hex'

/**
 * Size of one box header item (4B)
 * (4 bytes = 8 hex chars)
 */
const BOX_HEADER_ITEM_SIZE_HEX = 8
/**
 * Size of the whole header (8B = 16 hex chars)
 */
const BOX_HEADER_SIZE_HEX = BOX_HEADER_ITEM_SIZE_HEX * 2

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
 * one byte is represented by 2 hex chars
 */
const BYTE_TO_HEX_RATIO = 2

/**
 * Convert byte size to size in hex chars
 */
const byteSizeToHexSize = (size: number) => {
  return size * BYTE_TO_HEX_RATIO
}

/**
 * Convert size in hex chars to byte size
 */
const hexSizeToByteSize = (size: number) => {
  return size / BYTE_TO_HEX_RATIO
}

/**
 * Cut a substring
 *
 * @param text - text
 * @param interval - which part of the text to cut (both start and end included)
 */
const cut = (text: string, interval: Interval) => {
  return text.substring(interval.start, interval.end + 1)
}

/**
 * Read item from box header
 *
 * @param hex media file as hex
 * @param index where the item starts
 */
const readBoxHeaderItem = (hex: string, index: number) => {
  const itemInterval = interval(index, BOX_HEADER_ITEM_SIZE_HEX)

  if (itemInterval.end >= hex.length) {
    throw new Error('Invalid media file: File contains unfinished box header')
  }

  return cut(hex, itemInterval)
}

/**
 * Read box size
 *
 * @param hex media file as hex
 * @param index where the box starts in hex file
 */
const readBoxSize = (hex: string, index: number) => {
  return readBoxHeaderItem(hex, index)
}

/**
 * Read box type
 *
 * @param hex media file as hex
 * @param index where the box starts in hex file
 */
const readBoxType = (hex: string, index: number) => {
  return readBoxHeaderItem(hex, index + BOX_HEADER_ITEM_SIZE_HEX)
}

/**
 * Read box body
 *
 * @param hex media file as hex
 * @param index where the box starts in hex file
 * @param byteSize size of the box in bytes (1 byte == 2 hex chars)
 */
const readBoxBody = (hex: string, index: number, byteSize: number) => {
  const size = byteSizeToHexSize(byteSize)

  if (size < BOX_HEADER_SIZE_HEX) {
    throw new Error('Invalid media file: Box size is too small')
  } else if (size === BOX_HEADER_SIZE_HEX) {
    return ''
  }

  const startIndex = index + BOX_HEADER_SIZE_HEX
  const bodyInterval = interval(startIndex, size - BOX_HEADER_SIZE_HEX)

  return cut(hex, bodyInterval)
}

/**
 * Parse ISOBMFF file
 *
 * https://en.wikipedia.org/wiki/ISO_base_media_file_format#File_type_box
 *
 * @param {string} hex hex string representation of ISOBMFF media file data
 * @returns {Box[]} structure of the ISOBMFF file (array of boxes with optional nested boxes)
 */
export const parseIsobmff = (hex: string): Box[] => {
  const boxes: Box[] = []
  /**
   * Index in hex string
   */
  let index = 0

  while (index < hex.length) {
    const sizeHex = readBoxSize(hex, index)
    const size = hexToNumber(sizeHex)
    const typeHex = readBoxType(hex, index)
    const type = hexToText(typeHex)
    const data = readBoxBody(hex, index, size)

    const box: Box = {
      position: hexSizeToByteSize(index),
      size,
      type,
    }

    if (isNodeBox(box)) {
      box.children = parseIsobmff(data)
    } else {
      box.data = data
    }

    boxes.push(box)

    index += byteSizeToHexSize(box.size)
  }

  return boxes
}
