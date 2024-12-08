import { type User } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';
import { ClientsService } from '~/server/routes/clients/clients.route';
import { authenticateUser } from '~/server/utils/api.utils';

export async function DELETE(req: NextRequest) {
  const user = await authenticateUser();
  if (!user) return user; // This is the NextResponse from authenticateUser

  const clientId = req.url.split('/').pop();

  if (!clientId) {
    return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
  }

  return NextResponse.json(await ClientsService.deleteClient((user as User).id, clientId));
}
