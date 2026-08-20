import { type ContextWithMetadata } from '~/types/chat'
import { getBackendUrl } from '~/utils/apiUtils'

// Common function to fetch contexts from backend - can be used anywhere
export default async function fetchContextsFromBackend(
  course_name: string,
  search_query: string,
  token_limit = 4000,
  doc_groups: string[] = [],
  conversation_id?: string,
  signal?: AbortSignal,
  group?: string,
  username?: string,
): Promise<ContextWithMetadata[]> {
  const backendUrl = getBackendUrl()

  //console.log("[pages/util/fetchContexts.ts] fetchContextsFromBackend called:")
  //console.log("  - doc_groups:", doc_groups)
  //console.log("  - group:", group)

  const requestBody: {
    course_name: string
    search_query: string
    token_limit: number
    doc_groups: string[]
    conversation_id?: string
    group?: string
    username?: string
  } = {
    course_name: course_name,
    search_query: search_query,
    token_limit: token_limit,
    doc_groups: doc_groups,
    conversation_id: conversation_id,
  }

  if (group) {
    requestBody.group = group
  }
  if (username && username !== '') {
    requestBody.username = username
  }

  const response = await fetch(`${backendUrl}/getTopContexts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
    signal,
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch contexts. Status: ${response.status}`)
  }

  const data: ContextWithMetadata[] = await response.json()
  return data
}

// Helper function for use in components/utilities
export const fetchContexts = async (
  course_name: string,
  search_query: string,
  token_limit = 4000,
  doc_groups: string[] = [],
  conversation_id?: string,
  group?: string,
  username?: string,
): Promise<ContextWithMetadata[]> => {
  // Check if we're running on client-side (browser) or server-side
  const isClientSide = typeof window !== 'undefined'

  try {
    if (isClientSide) {
      // Client-side: use our API route
      const response = await fetch(
        `${window.location.origin}/api/getContexts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            course_name,
            search_query,
            token_limit,
            doc_groups,
            conversation_id,
            group,
            username,
          }),
        },
      )

      if (!response.ok) {
        console.error('Failed to fetch contexts. Err status:', response.status)
        return []
      }

      const data: ContextWithMetadata[] = await response.json()
      return data
    } else {
      // Server-side: use the common function directly
      return await fetchContextsFromBackend(
        course_name,
        search_query,
        token_limit,
        doc_groups,
        conversation_id,
        undefined,  // signal
        group,
        username,  // username
      )
    }
  } catch (error) {
    console.error('Error fetching contexts:', error)
    return []
  }
}

// Helper function for backward compatibility
export const fetchMQRContexts = async (
  course_name: string,
  search_query: string,
  token_limit = 6000,
  doc_groups: string[] = [],
  conversation_id: string,
  group?: string,
  username?: string,
): Promise<ContextWithMetadata[]> => {
  try {
    const params = new URLSearchParams({
      course_name,
      search_query,
      token_limit: token_limit.toString(),
    })

    // Handle doc_groups array
    doc_groups.forEach((group) => params.append('doc_groups', group))

    params.append('conversation_id', conversation_id)

    if (group) {
      params.append('group', group)
    }

    params.append('username', username || '')

    const response = await fetch(`/api/getContextsMQR?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error(
        'Failed to fetch MQR contexts. Err status:',
        response.status,
      )
      return []
    }

    const data: ContextWithMetadata[] = await response.json()
    return data
  } catch (error) {
    console.error(error)
    return []
  }
}
