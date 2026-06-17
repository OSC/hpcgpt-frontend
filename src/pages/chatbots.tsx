import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Dashboard from '~/components/OSC-Components/Dashboard'

import { useAuth } from 'react-oidc-context'
import { MainPageBackground } from '~/components/OSC-Components/MainPageBackground'
import { LoadingSpinner } from '~/components/OSC-Components/LoadingSpinner'
import { PermissionGate } from '~/components/OSC-Components/PermissionGate'
import { GroupPermissionGate } from '~/components/OSC-Components/GroupPermissionGate'
import { useGroupValidation } from '~/hooks/useGroupValidation'

const DashboardPage = () => {
  const router = useRouter()

  const auth = useAuth()
  const { course_name } = router.query
  const { hasAccess, loading } = useGroupValidation()

  if (auth.isLoading || loading) {
    return (
      <MainPageBackground>
        <LoadingSpinner />
      </MainPageBackground>
    )
  }

  if (!auth.isAuthenticated) {
    console.log(
      'User not logged in',
      auth.isAuthenticated,
      auth.isLoading,
      'NewCoursePage',
    )
    return (
      <GroupPermissionGate
        course_name={course_name ? (course_name as string) : 'new'}
      />
    )
  }

  // If user doesn't have group access, show access denied page
  if (hasAccess === false) {
    return (
      <GroupPermissionGate
        course_name={course_name ? (course_name as string) : 'new'}
        errorType={403}
      />
    )
  }

  const user_email = auth.user?.profile.email

  return (
    <Dashboard
      project_name={course_name as string}
      current_user_email={user_email as string}
    />
  )
}

export default DashboardPage
