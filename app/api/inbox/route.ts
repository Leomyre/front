// app/api/inbox/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('http://localhost:8000/inbox/', {
      credentials: 'include', // Inclure les cookies pour les sessions Django
    });

    if (!res.ok) {
      throw new Error('Erreur lors de la récupération des utilisateurs.');
    }

    const users = await res.json();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
