import React from 'react'
import { useGroupValidation } from '~/hooks/useGroupValidation'
import { GroupPermissionGate } from '~/components/OSC-Components/GroupPermissionGate'

interface GroupProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const GroupProtectedRoute: React.FC<GroupProtectedRouteProps> = ({
  children,
  fallback
}) => {
  const { hasAccess, loading } = useGroupValidation()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (hasAccess === false) {
    return <GroupPermissionGate course_name="protected" errorType={403} />
  }

  return <>{children}</>
}