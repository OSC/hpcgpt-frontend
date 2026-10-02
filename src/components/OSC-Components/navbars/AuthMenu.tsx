import { Menu, Avatar, type MantineNumberSize, rem, Tooltip, Notification } from '@mantine/core'
import { IconCopy, IconCheck } from '@tabler/icons-react'
import { useAuth } from 'react-oidc-context'
import { montserrat_heading } from 'fonts'
import { createStyles } from '@mantine/core'
import { getKeycloakIssuerUrl, initiateSignIn } from '~/utils/authHelpers'
import { useState } from 'react'

const useStyles = createStyles((theme) => ({
  link: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '2.2rem',
    minWidth: '100px',
    width: 'auto',
    padding: '0 0.75rem',
    color: 'var(--osc-orange)',
    backgroundColor: 'transparent',
    fontSize: rem(14),
    fontWeight: 500,
    border: `1px solid var(--osc-orange)`,
    borderRadius: '0.375rem',
    transition: 'background-color 100ms ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 95, 5, 0.05)',
    },
  },
  userAvatar: {
    cursor: 'pointer',
    transition: 'all 200ms ease',
    position: 'relative',
    overflow: 'hidden',
    border: '2px solid var(--border)',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      '&::after': {
        transform: 'translateX(100%)',
      },
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background:
        'linear-gradient(120deg, transparent 0%, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%, transparent 100%)',
      transform: 'translateX(-100%)',
      transition: 'transform 650ms ease',
    },
  },
  userMenu: {
    backgroundColor: 'var(--background)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '6px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    '.mantine-Menu-item': {
      color: 'var(--foreground)',
      borderRadius: '8px',
      fontSize: '14px',
      padding: '10px 16px',
      margin: '2px 0',
      fontWeight: 500,
      '&:hover': {
        backgroundColor: 'var(--muted)',
      },
    },
  },
}))

const getInitials = (name: string) => {
  const names = name.split(' ')
  if (names.length >= 2) {
    return `${names[0]?.[0] || ''}${names[names.length - 1]?.[0] || ''}`.toUpperCase()
  }
  return (names[0]?.[0] || '').toUpperCase()
}

interface AuthMenuProps {
  size?: MantineNumberSize
}

export const AuthMenu = ({ size = 34 }: AuthMenuProps) => {
  const { classes } = useStyles()
  const auth = useAuth()
  const [copied, setCopied] = useState(false)

  const copyJwtToClipboard = async () => {
    const token = auth.user?.access_token
    if (!token) {
      console.error('No JWT token available')
      return
    }

    try {
      await navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      // Show success feedback
      console.log('✅ JWT token copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy token:', err)
    }
  }

  if (auth.isAuthenticated) {
    return (
      <Menu
        position="bottom-end"
        offset={5}
        classNames={{
          dropdown: classes.userMenu,
        }}
      >
        <Menu.Target>
          <Avatar
            size={size}
            radius="xl"
            variant="gradient"
            gradient={{
              from: 'var(--osc-industrial)',
              to: 'var(--osc-blue)',
              deg: 135,
            }}
            className={classes.userAvatar}
            role="button"
            tabIndex={0}
            aria-label="User Menu"
          >
            {getInitials(auth.user?.profile.name || '')}
          </Avatar>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            tabIndex={0}
            onClick={() => {
              // Fixed URL construction to avoid realm duplication
              window.open(
                `${getKeycloakIssuerUrl(undefined)}/account`,
                '_blank',
              )
            }}
          >
            Manage Account
          </Menu.Item>

          <Menu.Item
            tabIndex={0}
            onClick={copyJwtToClipboard}
            rightSection={
              copied ? (
                <IconCheck style={{ width: rem(16), height: rem(16) }} />
              ) : (
                <IconCopy style={{ width: rem(16), height: rem(16) }} />
              )
            }
          >
            {copied ? 'Token Copied!' : 'Copy JWT Token'}
          </Menu.Item>

          <Menu.Item onClick={() => auth.signoutRedirect()} tabIndex={0}>
            Sign Out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    )
  }

  return (
    <button
      tabIndex={0}
      className={`${classes.link} login-btn`}
      onClick={() => void initiateSignIn(auth, window.location.pathname)}
    >
      <div
        className={`${montserrat_heading.variable} font-montserratHeading`}
        style={{ fontSize: '14px' }}
      >
        Sign in
      </div>
    </button>
  )
}
