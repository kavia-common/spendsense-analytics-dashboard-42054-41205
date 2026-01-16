/**
 * Centralized API configuration.
 * Uses environment variables; UI remains mocked for now.
 */

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_URL ||
  "";

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the configured API base URL (or empty string if not set). */
  return API_BASE;
}
