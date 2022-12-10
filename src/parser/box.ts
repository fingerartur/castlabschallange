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

/**
 * Checks if box is "node" aka has children
 */
export const isNodeBox = (box: Box) => {
  return ['moof', 'traf'].includes(box.type)
}
