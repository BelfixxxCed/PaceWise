import { NextResponse } from 'next/server';
import supabase from '@/supabase/supabase_client';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const { error } = await supabase.auth.signOut();
  if (cookieStore.get('user.id')) {
    cookieStore.delete('user.id');
    cookieStore.delete('user.data');
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Sign out successful' }, { status: 200 });
}