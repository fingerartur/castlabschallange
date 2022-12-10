export type Image = {
  id: string
  /**
   * Data base64 encoded data
   */
  data: string
  encoding: 'base64'
  /**
   * e.g. png (lowercase)
   */
  type: string
}
