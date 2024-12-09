import { type User } from '@clerk/nextjs/server';
import { type NextRequest, NextResponse } from 'next/server';
import { type z } from 'zod';
import { ClientsService } from '~/server/routes/clients/clients.route';
import { authenticateUser } from '~/server/utils/api.utils';
import { clientSchema } from '~/shared/schemas/client.schema';

export async function DELETE(req: NextRequest) {
  const user = await authenticateUser();
  if (!user) return user; // This is the NextResponse from authenticateUser

  const clientId = req.url.split('/').pop();

  if (!clientId) {
    return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
  }

  return NextResponse.json(await ClientsService.deleteClient((user as User).id, clientId));
}

export async function PUT(req: NextRequest) {
  const user = await authenticateUser();
  if (!user) return user; // This is the NextResponse from authenticateUser

  const clientId = req.url.split('/').pop();

  if (!clientId) {
    return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
  }

  const data = await req.json() as z.infer<typeof clientSchema>;

  const validationResult = clientSchema.safeParse(data);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        errors: validationResult.error.errors,
      },
      { status: 400 },
    );
  }

  return NextResponse.json(await ClientsService.updateClient((user as User).id, clientId, data));
}
