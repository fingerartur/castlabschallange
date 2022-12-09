/**
 * Box is a basic building block of ISOBMFF media file
 *
 * [[ 4B size ][ 4B type ][ ... data ...]]
 */
export type Box = {
  /**
   * Box data as hex string
   */
  data: string
  /**
   * Size in bytes that the box takes up (data + 8B header)
   *
   * Size info is stored in the first 4 bytes of the header
   */
  size: number
  /**
   * MP4 box type as a string (binary converted to string via char codes)
   *
   * Type info is stored in the second 4 bytes of the header
   */
  type: string
  /**
   * MP4 box type as hex
   *
   * Type info is stored in the second 4 bytes of the header
   */
  typeHex: string
}
