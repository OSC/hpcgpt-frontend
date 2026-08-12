import { useState, useEffect } from 'react'
import { useAuth } from 'react-oidc-context'
import { 
  Select, 
  Text, 
  Paper, 
  Title,
  Box,
  Alert,
  LoadingOverlay,
  Button
} from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { montserrat_heading, montserrat_paragraph } from 'fonts'

export const GroupsItem = () => {
  const auth = useAuth()
  const [groups, setGroups] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGroups = () => {
      if (auth.isAuthenticated && auth.user?.profile) {
        try {
          // Access groups from the user profile
          const userGroups = auth.user.profile.groups || []
          
          // Ensure groups is an array
          const groupsArray = Array.isArray(userGroups) ? userGroups : []
          
          setGroups(groupsArray)
          setError(null)
        } catch (err) {
          setError('Failed to load groups information.')
          console.error('Error fetching groups:', err)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [auth.isAuthenticated, auth.user])

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      <LoadingOverlay visible={loading} />
      
      <Box mb="md">
        <Title order={4} className={`${montserrat_heading.variable} font-montserratHeading`}>
          Groups
        </Title>
        <Text size="sm" className={`${montserrat_paragraph.variable} font-montserratParagraph`} c="dimmed">
          Select which OSC group to use from the list below
        </Text>
      </Box>

      {error && (
        <Alert 
          icon={<IconInfoCircle size="1rem" />} 
          title="Error" 
          color="red"
          mb="md"
        >
          {error}
        </Alert>
      )}

      {!auth.isAuthenticated ? (
        <Text c="dimmed">
          You must be signed in to view your groups.
        </Text>
      ) : groups.length === 0 ? (
        <Text c="dimmed">
          No groups found for your account.
        </Text>
      ) : (
        <Select
          label="Your Groups"
          placeholder="Select your group"
          data={groups.map(group => ({ value: group, label: group }))}
          searchable
          disabled={loading}
          className={`${montserrat_paragraph.variable} font-montserratParagraph`}
        />
      )}
    </Paper>
  )
}