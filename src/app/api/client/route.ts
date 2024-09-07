import { type NextRequest, NextResponse } from "next/server";
import { ClientsService } from "~/server/api/clients";
import type { ClientModel } from "~/server/db/schema";
import { clientSchema } from "~/shared/schemas/client.schema";
import { authenticateUser, handleError } from '~/server/utils/api.utils';
import { type User } from '@clerk/nextjs/server';

export async function GET() {
  const user = await authenticateUser();
  if (!user) return user; // This is the NextResponse from authenticateUser

  return NextResponse.json(await ClientsService.getClients((user as User).id));
}

export async function POST(req: NextRequest) {
  const user = await authenticateUser();
  if (!user) return user; // This is the NextResponse from authenticateUser

  const data = (await req.json()) as ClientModel;

  const validationResult = clientSchema.safeParse(data);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        errors: validationResult.error.errors,
      },
      { status: 400 },
    );
  }

  try {
    const resp = await ClientsService.saveClient({
      ...data,
      userId: (user as User).id,
    });
    return NextResponse.json(resp);
  } catch (error) {
    return handleError(error);
  }
}
