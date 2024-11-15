// frontend/services/api.ts
import { Message } from '@/types/message';
import { User } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/';

// Fonction pour gérer la connexion de l'utilisateur
export const handleLogin = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`Erreur de connexion: ${await response.text()}`);
    }

    const data = await response.json();
    const { access, refresh } = data;

    if (access && refresh) {
      // Enregistre les tokens dans le localStorage
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      console.log('Access token:', access);
      console.log('Refresh token:', refresh);
    } else {
      throw new Error("Les tokens d'accès et de rafraîchissement sont manquants.");
    }

  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    throw error;
  }
};

// Fonction pour rafraîchir le token d'accès
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    console.error("Le refresh token est manquant.");
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
      throw new Error(`Erreur lors du renouvellement du token d'accès: ${await response.text()}`);
    }

    const data = await response.json();
    const newAccessToken = data.access;
    if (newAccessToken) {
      localStorage.setItem('accessToken', newAccessToken); // Met à jour le token d'accès
      return newAccessToken;
    }

    console.error("Réponse invalide lors du rafraîchissement du token.");
    return null;
  } catch (error) {
    console.error("Erreur lors du renouvellement du token:", error);
    return null;
  }
};

// Fonction pour obtenir un token d'accès valide
export const getAccessToken = async (): Promise<string> => {
  let accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    // Si le token d'accès est manquant, tenter de le rafraîchir
    accessToken = await refreshAccessToken();
  }

  // Si le refresh échoue ou aucun token valide n'est trouvé, une erreur est lancée
  if (!accessToken) {
    throw new Error("Impossible d'obtenir un token d'accès valide.");
  }

  return accessToken;
};


// Fonction pour récupérer les conversations de l'utilisateur
export const fetchUserConversations = async (): Promise<User[]> => {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${API_URL}conversations/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,  // Utiliser le token valide
      },
      cache: 'no-store',
    });

    // Si la réponse est correcte, renvoyer les conversations
    if (response.ok) {
      const data = await response.json();
      return data;
    }

    // Si le token d'accès a expiré (erreur 401), tenter de rafraîchir le token
    if (response.status === 401) {
      console.log("Token expiré, tentative de rafraîchissement...");
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        console.log("Nouveau token d'accès récupéré :", newAccessToken);
        // Réessayez la requête avec le nouveau token
        return fetchUserConversations();
      } else {
        throw new Error("Impossible de rafraîchir le token d'accès.");
      }
    }

    // Si une autre erreur se produit, lancer une exception
    throw new Error('Erreur de récupération des conversations.');

  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
    throw error;  // Propager l'erreur pour que l'appelant puisse la gérer
  }
};

// Fonction pour récupérer les messages d'une conversation
export const fetchConversationMessages = async (receiverId: number): Promise<Message[]> => {
  const accessToken = await getAccessToken();  // Utilisation correcte de la promesse

  if (!accessToken) {
    throw new Error('Token d\'accès manquant');
  }

  const response = await fetch(`${API_URL}messages/?receiver_id=${receiverId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des messages');
  }

  const data = await response.json();
  return data;
};

export const sendMessageToReceiver = async (receiverId: number, message: string) => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error('Token d\'accès manquant');
  }

  const response = await fetch(`${API_URL}messages/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      receiver_id: receiverId,
      content: message,
    }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de l\'envoi du message');
  }

  const data = await response.json();
  return data;
};