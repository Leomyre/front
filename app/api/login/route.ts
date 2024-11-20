// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
      console.log('Requête reçue dans /api/login');
      const body = await req.json();
      console.log('Corps de la requête :', body);
  
      const res = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
  
      if (!res.ok) {
        console.error('Erreur lors de la connexion à Django :', res.status, res.statusText);
        throw new Error('Erreur lors de la connexion.');
      }
  
      const data = await res.json();
      console.log('Données reçues depuis Django :', data);
  
      return NextResponse.json(data);
    } catch (error) {
      console.error('Erreur dans /api/login :', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  