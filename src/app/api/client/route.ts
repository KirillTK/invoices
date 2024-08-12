import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getClients, saveClient } from "~/server/clients";
import type { ClientModel } from '~/server/db/schema';
import { isPostgresError } from '~/server/utils/db.utils';
import { clientSchema } from '~/shared/schemas/client.schema';

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await getClients(user.id));
}

export async function POST(req: NextRequest) {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json() as ClientModel;

  const validationResult = clientSchema.safeParse(data);

  if(!validationResult.success) {
    return NextResponse.json({
      errors: validationResult.error.errors,
    }, { status: 400 });
  }


  try {
    const resp = await saveClient({
      ...data,
      userId: user.id,
    });
    return NextResponse.json(resp);
  } catch (error) {  
    return NextResponse.json({
      message: isPostgresError(error) ? error.detail : 'Internal Error',
    }, { status: 500 }); 
  }
}