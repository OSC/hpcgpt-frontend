import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import MakeNewCoursePage from '~/components/OSC-Components/MakeNewCoursePage'

import { useAuth } from 'react-oidc-context'
import { MainPageBackground } from '~/components/OSC-Components/MainPageBackground'
import { LoadingSpinner } from '~/components/OSC-Components/LoadingSpinner'
import { GroupPermissionGate } from '~/components/OSC-Components/GroupPermissionGate'
import { useGroupValidation } from '~/hooks/useGroupValidation'

const NewCoursePage = () => {
  const router = useRouter()

  const auth = useAuth()
  const { course_name } = router.query
  const { hasAccess, loading } = useGroupValidation()

  useEffect(() => {
    // You can add any additional logic you need here, such as fetching data based on the course_name
  }, [course_name])

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
    <MakeNewCoursePage
      project_name={course_name as string}
      current_user_email={user_email as string}
      is_new_course={true}
    />
  )
}

export default NewCoursePage
