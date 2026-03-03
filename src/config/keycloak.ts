import { getKeycloakBaseUrl } from '~/utils/authHelpers'

const keycloakConfig = {
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'osc-chat-realm',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'osc-chat',
  url: getKeycloakBaseUrl(),
}

export default keycloakConfig
