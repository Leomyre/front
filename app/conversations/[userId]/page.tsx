'use client';

import React, { useEffect, useState } from 'react';
import { fetchConversationMessages } from '@/services/api';  // Assure-toi que cette fonction est définie
import { useSearchParams } from 'next/navigation';

const ConversationPage: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');  // Récupère l'id de l'utilisateur dans les params

  useEffect(() => {
    const loadMessages = async () => {
      if (!userId) return;  // Si aucun userId n'est fourni, on arrête

      try {
        const data = await fetchConversationMessages(userId);  // Envoie la requête pour récupérer les messages
        setMessages(data);
      } catch (error) {
        setError('Erreur lors de la récupération des messages');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [userId]);

  if (loading) {
    return <div>Chargement des messages...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Messages avec l'utilisateur {userId}</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <strong>{message.sender}: </strong>
            <p>{message.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationPage;
