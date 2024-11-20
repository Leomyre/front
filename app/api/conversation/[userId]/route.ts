// app/api/conversation/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const res = await fetch(`http://localhost:8000/conversation/${params.userId}/`, {
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Erreur lors de la récupération des messages.');
    }

    const messages = await res.json();
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const body = await req.json();
    const res = await fetch(`http://localhost:8000/conversation/${params.userId}/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error('Erreur lors de l\'envoi du message.');
    }

    const message = await res.json();
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
