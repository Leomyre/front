// frontend/services/authService.ts
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/';

export const getAccessToken = () => Cookies.get('accessToken');
export const getRefreshToken = () => Cookies.get('refreshToken');

// Store tokens in cookies with secure and httpOnly flags
export const storeTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set('accessToken', accessToken, { secure: true, httpOnly: true, sameSite: 'Strict' });
  Cookies.set('refreshToken', refreshToken, { secure: true, httpOnly: true, sameSite: 'Strict' });
};

// Refresh the access token using the refresh token
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    console.error("Refresh token manquant");
    return null;
  }

  try {
    const response = await fetch(`${API_URL}token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Erreur de renouvellement du token. Code d'erreur: " + response.status);
    }

    const data = await response.json();
    if (data.access) {
      Cookies.set('accessToken', data.access, { secure: true, httpOnly: true, sameSite: 'Strict' });
      return data.access;
    }

    throw new Error("Aucun token d'accès trouvé dans la réponse.");
  } catch (error) {
    console.error("Erreur lors du renouvellement du token:", error);
    return null;
  }
};

