import { binaryToHex } from './hex'

/**
 * Fetch file and convert data from body to hex
 */
export const fetchHex = async (uri: string) => {
  const response = await fetch(uri, {
    method: 'GET',
  })

  const binary = await response.arrayBuffer()
  const hex = binaryToHex(binary)

  return hex
}
