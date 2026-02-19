// API Configuration
// Default to deployed API so the app matches Postman requests.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://ajourne.vercel.app/api/v1';

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Make API request with error handling
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  try {
    const url = `${apiConfig.baseURL}${endpoint}`;
    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers: {
          ...apiConfig.headers,
          ...options.headers,
        },
      });
    } catch (fetchErr) {
      console.error('[api.config] Network error fetching', url, fetchErr);
      throw fetchErr;
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      let parsed: any = null;
      try { parsed = text ? JSON.parse(text) : null; } catch { parsed = text; }
      console.error('[api.config] Non-OK response', { status: response.status, body: parsed });
      const errMsg = parsed?.message || `HTTP ${response.status}`;
      throw new Error(errMsg);
    }

    const bodyText = await response.text();
    try {
      return JSON.parse(bodyText);
    } catch {
      return bodyText;
    }
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};
