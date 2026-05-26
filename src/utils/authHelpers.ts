export const initiateSignIn = (auth: any, redirectPath: string) => {
  console.log('[AuthHelper] Initiating sign in with redirect:', redirectPath)
  // Use URL-safe base64 encoding
  const state = btoa(
    JSON.stringify({
      redirect: redirectPath,
      timestamp: Date.now(),
    }),
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  return auth.signinRedirect({ state })
}

// frontend
export const getKeycloakBaseUrl = () => {
  if (
    process.env.NEXT_PUBLIC_KEYCLOAK_URL &&
    process.env.NEXT_PUBLIC_KEYCLOAK_URL.trim() !== ''
  ) {
    return process.env.NEXT_PUBLIC_KEYCLOAK_URL
  }

  if (typeof window === 'undefined') return ''

  const hostname = window.location.hostname

  if (hostname === 'localhost') {
    return 'http://localhost:8080/'
  }

  if (hostname === 'osc.chat') {
    return 'https://login.osc.chat/'
  }

  return `${window.location.origin}/keycloak/`
}

// backend
export function getKeycloakBaseFromHost(hostname: string | undefined): string {
  if (
    process.env.NEXT_PUBLIC_KEYCLOAK_URL &&
    process.env.NEXT_PUBLIC_KEYCLOAK_URL.trim() !== ''
  ) {
    return process.env.NEXT_PUBLIC_KEYCLOAK_URL
  }
  if (hostname === 'localhost') return 'http://localhost:8080/'
  if (hostname === 'osc.chat') return 'https://login.osc.chat/'
  return `https://${hostname}/keycloak/`
}

export function getRealmFromIssuer(issuerUrl: string | undefined): string | null {
  if (!issuerUrl) return null;

  try {
    const url = new URL(issuerUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);

    const realmsIndex = pathParts.indexOf('realms');
    if (realmsIndex !== -1 && realmsIndex + 1 < pathParts.length) {
      return pathParts[realmsIndex + 1] ?? null;
    }
  } catch (error) {
    return null;
  }
  return null;
}
// Get issuer URL (always use public URL since that's what Keycloak issues)
export function getKeycloakIssuerUrl(hostname: string|undefined): string {
  // Always use the public URL for issuer verification
  if (process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER_URL && process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER_URL.trim() !== '') {
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'osc_chat_realm';
    return `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER_URL}`;
  }
  if (process.env.NEXT_PUBLIC_KEYCLOAK_URL && process.env.NEXT_PUBLIC_KEYCLOAK_URL.trim() !== '') {
    const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'osc_chat_realm';
    return `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${realm}`;
  }
  if (hostname === 'localhost') return 'http://localhost:8080/realms/osc_chat_realm';
  if (hostname === 'osc.chat') return 'https://login.osc.chat/realms/osc_chat_realm';
  return `https://${hostname}/keycloak/realms/osc_chat_realm`;
}
