// frontend/pages/conversations.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { fetchUserConversations } from '../services/api';
import { User } from '../types/user';
import Link from 'next/link';  // Import de Link depuis Next.js

const ConversationsList: React.FC = () => {
  const [conversations, setConversations] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await fetchUserConversations();
        setConversations(data);
      } catch (error) {
        setError('Erreur lors de la récupération des conversations');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  if (loading) {
    return <div>Chargement des conversations...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Mes Conversations fhfgffdg</h2>
      <ul>
        {conversations.map((user, index) => (
          <li key={index}>
            <Link href={`/conversation/${user.id}`}>
              {user.username}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationsList;
