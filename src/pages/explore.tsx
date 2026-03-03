import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Explore from '~/components/OSC-Components/Explore'

import { useAuth } from 'react-oidc-context'
import { MainPageBackground } from '~/components/OSC-Components/MainPageBackground'
import { LoadingSpinner } from '~/components/OSC-Components/LoadingSpinner'
import { AuthComponent } from '~/components/OSC-Components/AuthToEditCourse'

const ExplorePage = () => {
  const router = useRouter()

  const auth = useAuth()
  const { course_name } = router.query

  useEffect(() => {
    // You can add any additional logic you need here, such as fetching data based on the course_name
  }, [course_name])

  if (auth.isLoading) {
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
      <AuthComponent
        course_name={course_name ? (course_name as string) : 'new'}
      />
    )
  }

  const user_email = auth.user?.profile.email

  return (
    <Explore
      project_name={course_name as string}
      current_user_email={user_email as string}
    />
  )
}

export default ExplorePage
