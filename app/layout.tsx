// frontend/app/layout.tsx

import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Messagerie',
  description: 'Application de messagerie avec Django et Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
