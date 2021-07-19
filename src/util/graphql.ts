import nodeFetch from 'node-fetch'

export async function fetch(uri, options) {
  const response = await nodeFetch(uri, options)
  if (response.status >= 400) {
    throw new Error(`Source GraphQL API: HTTP error ${response.status} ${response.statusText}`)
  }
  return response
}
