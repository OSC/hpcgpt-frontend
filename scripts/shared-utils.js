// Shared utilities that work in both Node.js and browser environments

/**
 * Get Keycloak base URL based on environment
 * @param {string} hostname - The hostname to check
 * @param {string} protocol - The protocol (http/https)
 * @returns {string} The Keycloak base URL
 */
function getKeycloakBaseUrl(hostname = null, protocol = null) {
  // For Node.js environment (scripts)
  if (typeof window === 'undefined') {
    return process.env.KEYCLOAK_BASE_URL || 'https://login.osc.chat/'
  }

  // For browser environment
  if (hostname === 'localhost') {
    return 'http://localhost:8080/'
  }
  
  if (hostname === 'osc.chat') {
    return 'https://login.osc.chat/'
  }

  return `${protocol}://${hostname}/keycloak/`
}

module.exports = {
  getKeycloakBaseUrl,
}
