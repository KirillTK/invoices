import { type User, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { isPostgresError } from './db.utils';

export async function authenticateUser(): Promise<User | NextResponse> {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return user;
}

export function handleError(error: unknown) {
  console.error(error);
  return NextResponse.json(
    {
      message: isPostgresError(error) ? error.detail : "Internal Error",
    },
    { status: 500 },
  );
}