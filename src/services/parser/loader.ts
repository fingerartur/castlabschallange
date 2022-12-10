
/**
 * Fetch file and get binary data from it
 */
export const fetchBinary = async (uri: string) => {
  const response = await fetch(uri, {
    method: 'GET',
  })

  const binary = await response.arrayBuffer()
  return new Uint8Array(binary)
}
