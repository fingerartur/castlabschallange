import { binaryToNumber, binaryToText } from './binary'
import { Box, isDataBox, isNodeBox } from './box'

/**
 * Max supported depth of nesting of boxes
 */
const BOX_MAX_NESTING_DEPTH = 1000

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
 * Binary data window represent part of binary data in the interval [start, end]
 */
type BinaryDataWindow = {
  data: Uint8Array
  start: number
  end: number
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
 * @param dataWindow part of media file
 * @returns copy of this part of media file
 */
const copyBoxBody = (dataWindow: BinaryDataWindow): Uint8Array => {
  return dataWindow.data.slice(dataWindow.start, dataWindow.end + 1)
}

/**
 * Read item from box header as binary
 *
 * @param dataWindow part of media file
 * @param index where the item starts
 * @returns 4 bytes of binary
 */
const readBoxHeaderItem = (dataWindow: BinaryDataWindow, index: number): Uint8Array => {
  const itemInterval = interval(index, BOX_HEADER_ITEM_BYTE_SIZE)

  if (itemInterval.end > dataWindow.end) {
    throw new Error('Invalid media file: File contains unfinished box header')
  }

  return copy(dataWindow.data, itemInterval)
}

/**
 * Read box size
 *
 * @param dataWindow part of media file
 * @param index where the box starts in medial file
 */
const readBoxSize = (dataWindow: BinaryDataWindow, index: number): number => {
  const item = readBoxHeaderItem(dataWindow, index)
  return binaryToNumber(item.reverse(), '32-bit')
}

/**
 * Read box type
 *
 * @param dataWindow part of media file
 * @param index where the box starts in medial file
 */
const readBoxType = (dataWindow: BinaryDataWindow, index: number) => {
  const item = readBoxHeaderItem(dataWindow, index + BOX_HEADER_ITEM_BYTE_SIZE)
  return binaryToText(item, 'utf-8')
}

/**
 * @param dataWindow part of media file
 * @param index byte index where the box starts
 * @param byteSize size of the box in bytes
 *
 * @returns data window that represents the body of a box. Resulting data window always has some data
 * in it, if it doesn't `null` is returned.
 */
const getBoxBodyWindow = (dataWindow: BinaryDataWindow, index: number, size: number): BinaryDataWindow | null => {
  if (size < BOX_HEADER_BYTE_SIZE) {
    throw new Error('Invalid media file: Box size is too small')
  } else if (size === BOX_HEADER_BYTE_SIZE) {
    return null
  }

  const bodyInterval = interval(index + BOX_HEADER_BYTE_SIZE, size - BOX_HEADER_BYTE_SIZE)

  return { data: dataWindow.data, start: bodyInterval.start, end: bodyInterval.end}
}

type ParseInfo = {
  depth: number
}

/**
 * Parse ISOBMFF file
 *
 * Supports max box nesting max 1000 boxes deep.
 *
 * https://en.wikipedia.org/wiki/ISO_base_media_file_format#File_type_box
 *
 * @param binary binary data of ISOBMFF media file
 * @returns {Box[]} structure of the ISOBMFF file
 */
export const parseIsobmff = (binary: Uint8Array): Box[] => {
  return _parseIsobmff({ data: binary, start: 0, end: binary.length -1 }, { depth: 1})
}

const _parseIsobmff = (dataWindow: BinaryDataWindow, info: ParseInfo): Box[] => {
  if (info.depth > BOX_MAX_NESTING_DEPTH) {
    throw new Error(`Media file has too deeply nested boxes - more than ${BOX_MAX_NESTING_DEPTH} levels`)
  }

  const boxes: Box[] = []
  /**
   * Index in binary data
   */
  let index = dataWindow.start

  while (index <= dataWindow.end) {
    const size = readBoxSize(dataWindow, index)
    const type = readBoxType(dataWindow, index)

    const box: Box = {
      position: index,
      size,
      type,
    }

    const boxBodyDataWindow = getBoxBodyWindow(dataWindow, index, size)

    if (boxBodyDataWindow != null) {
      if (isNodeBox(box)) {
        box.children = _parseIsobmff(boxBodyDataWindow, { depth: info.depth + 1 })
      } else if (isDataBox(box)) {
        box.data = copyBoxBody(boxBodyDataWindow)
      }
    }

    boxes.push(box)

    index += box.size
  }

  return boxes
}
