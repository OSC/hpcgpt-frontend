import { getKeycloakBaseUrl, getRealmFromIssuer } from '~/utils/authHelpers'

const keycloakConfig = {
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM ||
         (process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER_URL ? getRealmFromIssuer(process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER_URL) : null) || 'osc-chat-realm',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'osc-chat',
  url: getKeycloakBaseUrl(),
}

export default keycloakConfig
