// frontend/app/inbox/page.tsx

import ConversationsList from '@/components/ConversationsList';

export default function InboxPage() {
  return (
    <div>
      <h1>Boîte de Réception</h1>
      <ConversationsList />
    </div>
  );
}
