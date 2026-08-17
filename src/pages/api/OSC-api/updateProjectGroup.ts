import { type NextApiResponse } from 'next'
import { type AuthenticatedRequest } from '~/utils/authMiddleware'
import { getBackendUrl } from '~/utils/apiUtils'
import { withCourseOwnerOrAdminAccess } from '~/pages/api/authorization'

type UpdateProjectGroupResponse = {
  success: boolean
  error?: string
}

const handler = async (
  req: AuthenticatedRequest,
  res: NextApiResponse<UpdateProjectGroupResponse>,
) => {
  try {
    if (req.method !== 'POST') {
      console.error('Request method not allowed')
      return res.status(405).json({
        success: false,
        error: '❌❌ Request method not allowed',
      })
    }

    const { project_name, group } = req.body

    //console.log(
    //  '👉 Updating project group:',
    //  project_name,
    //  group ? `group: ${group}` : '(no group)',
    //)

    if (!project_name) {
      console.error('Missing body parameters')
      return res.status(400).json({
        success: false,
        error: '❌❌ Missing body parameters',
      })
    }

    const backendUrl = getBackendUrl()
    //console.log(`👉 Calling backend URL: ${backendUrl}/updateProjectGroup`)

    const response = await fetch(`${backendUrl}/updateProjectGroup`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project_name,
        group,
      }),
    })

    //console.log(`📤 Backend response status: ${response.status}`)
    //console.log(`📤 Backend response headers:`, Object.fromEntries(response.headers.entries()))

    const contentType = response.headers.get('content-type')
    let responseBody: any

    if (contentType && contentType.includes('application/json')) {
      responseBody = await response.json()
      //console.log(`📤 Backend response body:`, responseBody)
    } else {
      // Not JSON - probably HTML error page
      const errorText = await response.text()
      console.error(`📤 Backend returned non-JSON response (length: ${errorText.length}):`, errorText.substring(0, 500))
      return res.status(response.status).json({
        success: false,
        error: `Backend returned ${response.status}: ${response.statusText}. Response: ${errorText.substring(0, 200)}`,
      })
    }

    if (!response.ok) {
      return res.status(response.status).json(responseBody)
    }

    return res.status(200).json(responseBody)
  } catch (error) {
    const err = `❌❌ -- Bottom of /updateProjectGroup -- Internal Server Error: ${error}`
    console.error(err)
    return res.status(500).json({ success: false, error: err })
  }
}

export default withCourseOwnerOrAdminAccess()(handler)
