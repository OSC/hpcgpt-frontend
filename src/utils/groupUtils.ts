/**
 * Utility functions for handling Keycloak group information
 */

/**
 * Extracts group information from a Keycloak token payload
 * @param tokenPayload - Decoded JWT token payload
 * @returns Array of group names or empty array if none found
 */
export function extractGroupsFromToken(tokenPayload: any): string[] {
  // Check if groups are present in the token payload
  if (tokenPayload && typeof tokenPayload === 'object' && tokenPayload.groups) {
    // Ensure it's an array of strings
    if (Array.isArray(tokenPayload.groups)) {
      return tokenPayload.groups.filter((group: any) => typeof group === 'string');
    }
    // Handle case where groups might be a single string instead of array
    if (typeof tokenPayload.groups === 'string') {
      return [tokenPayload.groups];
    }
  }

  // Return empty array if no groups found
  return [];
}

/**
 * Checks if a user belongs to any of the allowed groups
 * @param userGroups - Array of groups the user belongs to
 * @param allowedGroups - Array of allowed group names
 * @returns true if user belongs to any allowed group, false otherwise
 */
export function isUserInAllowedGroups(userGroups: string[], allowedGroups: string[]): boolean {
  // If no allowed groups are specified, allow access
  if (!allowedGroups || allowedGroups.length === 0) {
    return true;
  }

  // If user has no groups, deny access
  if (!userGroups || userGroups.length === 0) {
    return false;
  }

  // Check if any user group is in the allowed groups list (case-insensitive)
  return userGroups.some(userGroup =>
    allowedGroups.some(allowedGroup =>
      userGroup.toLowerCase() === allowedGroup.toLowerCase()
    )
  );
}

/**
 * Parses environment variable containing comma-separated group names
 * @param envVarValue - Raw value from environment variable
 * @returns Array of group names, or empty array if none found
 */
export function parseAllowedGroupsFromEnv(envVarValue: string | undefined): string[] {
  if (!envVarValue || typeof envVarValue !== 'string') {
    return [];
  }

  // Split by comma and trim whitespace from each group name
  return envVarValue
    .split(',')
    .map(group => group.trim())
    .filter(group => group.length > 0);
}

/**
 * Validates that group names are properly formatted
 * @param groups - Array of group names to validate
 * @returns true if all groups are valid, false otherwise
 */
export function validateGroupNames(groups: string[]): boolean {
  return groups.every(group =>
    typeof group === 'string' && group.trim().length > 0
  );
}

/**
 * Check if user has access based on allowed groups
 * @param userGroups - Groups the user belongs to
 * @param allowedGroupsEnv - Comma-separated list of allowed groups from environment
 * @returns true if user has access, false otherwise
 */
export function hasGroupAccessForLogin(userGroups: string[], allowedGroupsEnv?: string): boolean {
  // If no allowed groups are defined in environment, allow access
  if (!allowedGroupsEnv || allowedGroupsEnv.trim() === '') {
    return true;
  }

  // Parse allowed groups from environment variable
  const allowedGroups = parseAllowedGroupsFromEnv(allowedGroupsEnv);

  // If no allowed groups are specified, allow access
  if (!allowedGroups || allowedGroups.length === 0) {
    return true;
  }

  // Check if user belongs to any allowed group
  return isUserInAllowedGroups(userGroups, allowedGroups);
}