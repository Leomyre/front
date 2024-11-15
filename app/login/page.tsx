// front/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { handleLogin } from '@/services/api';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Fonction pour gérer la soumission du formulaire
  const handleSubmitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await handleLogin(username, password); // Appel de la fonction handleLogin
      router.push('/inbox'); // Rediriger après la connexion réussie
    } catch (error: any) {
      setError('Erreur de connexion : ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmitForm}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Nom d'utilisateur:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Mot de passe:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Chargement...' : 'Se connecter'}
        </button>
      </form>
      <p>Pas encore inscrit ? <a href="/signup">Inscrivez-vous ici</a>.</p>
    </div>
  );
};

export default LoginPage;
