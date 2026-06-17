import { useEffect, useState } from 'react'
import { useAuth } from 'react-oidc-context'
import { hasGroupAccessForLogin } from '~/utils/groupUtils'

export function useGroupValidation() {
  const auth = useAuth()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (auth.isLoading) {
      setLoading(true)
      return
    }

    if (!auth.isAuthenticated) {
      setHasAccess(false)
      setLoading(false)
      return
    }

    // Check group access
    const allowedGroupsEnv = process.env.NEXT_PUBLIC_ALLOWED_GROUPS
    //const allowedGroupsEnv = process.env.ALLOWED_GROUPS
    if (!allowedGroupsEnv || allowedGroupsEnv.trim() === '') {
      setHasAccess(true)  // No restrictions
      setLoading(false)
      return
    }

    // Get user groups from authentication profile
    const userGroups = auth.user?.profile?.groups || []
    const groupsArray = Array.isArray(userGroups) ? userGroups : []

    // Validate group access
    const hasAccess = hasGroupAccessForLogin(groupsArray, allowedGroupsEnv)
    setHasAccess(hasAccess)
    setLoading(false)
  }, [auth.isLoading, auth.isAuthenticated, auth.user])

  return { hasAccess, loading }
}
