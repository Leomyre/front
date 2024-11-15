// frontend/app/inbox/[userId]/page.tsx

// frontend/pages/conversation/[id].tsx

'use client';

import React, { useEffect, useState } from 'react';
import { fetchConversationMessages, sendMessageToReceiver } from '@/services/api';
import { Message } from '@/types/message';
import { useRouter } from 'next/navigation';

const ConversationPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { id } = router.query; // Récupère l'ID du destinataire depuis l'URL

  useEffect(() => {
    if (!id) return; // Si l'ID du destinataire n'est pas encore disponible

    const loadMessages = async () => {
      try {
        const data = await fetchConversationMessages(Number(id)); // Passer l'ID du destinataire
        setMessages(data);
      } catch (error) {
        setError('Erreur lors de la récupération des messages');
        console.error(error);
        router.push('/login'); // Redirige si une erreur d'authentification se produit
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [id, router]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return; // Ne pas envoyer un message vide

    try {
      // Utilisez une fonction pour envoyer le message
      await sendMessageToReceiver(Number(id), newMessage); // Passer l'ID du destinataire
      setNewMessage(''); // Réinitialiser le champ du message
      // Recharger les messages après l'envoi
      const data = await fetchConversationMessages(Number(id)); // Passer l'ID du destinataire
      setMessages(data);
    } catch (error) {
      setError('Erreur lors de l\'envoi du message');
      console.error(error);
    }
  };

  if (loading) {
    return <div>Chargement des messages...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Conversation avec ID {id}</h2>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.sender}</strong>: {message.content}
          </div>
        ))}
      </div>
      <div>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrire un message..."
        />
        <button onClick={handleSendMessage}>Envoyer</button>
      </div>
    </div>
  );
};

export default ConversationPage;
