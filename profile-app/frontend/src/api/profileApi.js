const BASE_URL = process.env.REACT_APP_API_URL || "/api";

/**
 * Fetches the user profile from the backend.
 * @returns {Promise<Object>} The profile data object.
 */
export async function getProfile() {
  const response = await fetch(`${BASE_URL}/profile`);
  if (!response.ok) {
    throw new Error(`Failed to fetch profile. Server responded with status ${response.status}`);
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || "Failed to fetch profile");
  }
  return result.data;
}

/**
 * Updates the user profile on the backend.
 * @param {Object} data - The partial profile fields to update.
 * @returns {Promise<Object>} The updated profile data object.
 */
export async function updateProfile(data) {
  const response = await fetch(`${BASE_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to update profile. Server responded with status ${response.status}`);
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || "Failed to update profile");
  }
  return result.data;
}
