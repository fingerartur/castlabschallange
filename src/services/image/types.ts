/**
 * Image
 */
export type Image = {
  id: string
  dataUrl: string
  encoding: 'base64'
  /**
   * e.g. png (lowercase)
   */
  type: string
}
