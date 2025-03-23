import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { type z } from 'zod';
import { UsersService } from '~/server/routes/users/users.route';
import { handleError } from '~/server/utils/api.utils';
import { userSchema } from '~/shared/schemas/user.schema';


export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await UsersService.getUser(userId);

  return NextResponse.json(user);
}


export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json() as z.infer<typeof userSchema>;

  const validationResult = userSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        errors: validationResult.error.errors,
      },
      { status: 400 },
    );
  }

  try {
    const resp = await UsersService.updateUser({ ...body, id: userId });
    return NextResponse.json(resp);
  } catch (error) {
    return handleError(error);
  }
}
