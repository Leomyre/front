// frontend/pages/index.tsx

import React from 'react';
import ConversationsList from '@/components/ConversationsList';

const HomePage: React.FC = () => {
  return (
    <div>
      <ConversationsList />
    </div>
  );
};

export default HomePage;
