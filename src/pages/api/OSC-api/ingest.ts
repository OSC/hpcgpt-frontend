import { type NextApiResponse } from 'next'
import { type AuthenticatedRequest } from '~/utils/authMiddleware'
import { withCourseOwnerOrAdminAccess } from '~/pages/api/authorization'

type IngestResponse = {
  task_id?: string
  error?: string
}

const handler = async (
  req: AuthenticatedRequest,
  res: NextApiResponse<IngestResponse>,
) => {
  try {
    if (req.method !== 'POST') {
      console.error('Request method not allowed')
      return res.status(405).json({
        error: '❌❌ Request method not allowed',
      })
    }

    const { uniqueFileName, courseName, readableFilename, forceEmbeddings, group } =
      req.body

    console.log(
      '👉 Submitting to ingest queue:',
      uniqueFileName,
      courseName,
      readableFilename,
      forceEmbeddings,
      group ? `group: ${group}` : '(no group specified)',
    )

    if (!uniqueFileName || !courseName || !readableFilename) {
      console.error('Missing body parameters')
      return res.status(400).json({
        error: '❌❌ Missing body parameters',
      })
    }

    const s3_filepath = `courses/${courseName}/${uniqueFileName}`

    let username = req.body.username
    if (!username) {
      username = req.headers['x-osc-user'] as string | undefined
    }
    if (!username && req.user) {
      username = req.user?.preferred_username || req.user?.sub || req.user?.email || ''
    }
    const requestBody: {
      course_name: string
      readable_filename: string
      s3_paths: string
      force_embeddings?: boolean
      group?: string
      username?: string
    } = {
      course_name: courseName,
      readable_filename: readableFilename,
      s3_paths: s3_filepath,
      force_embeddings: forceEmbeddings,
    }

    if (group) {
      requestBody.group = group
    }
    if (username) {
      requestBody.username = username
    }

    const response = await fetch(`${process.env.INGEST_URL}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const responseBody = await response.json()
    console.log(
      `📤 Submitted to ingest queue: ${s3_filepath}. Response status: ${response.status}`,
      responseBody,
    )

    return res.status(200).json(responseBody)
  } catch (error) {
    const err = `❌❌ -- Bottom of /ingest -- Internal Server Error during ingest submission to Beam: ${error}`
    console.error(err)
    return res.status(500).json({ error: err })
  }
}

export default withCourseOwnerOrAdminAccess()(handler)
