import { type ClerkUserPayload } from '~/entities/user/model/clerk-user-payload.model';
import { UsersService } from '~/server/routes/users/users.route';


export async function POST(req: Request) {
  const { type, data } = await req.json() as { type: string; data: ClerkUserPayload };

  if (type === "user.created") {
    const email = data.email_addresses.find(
      email => email.id === data.primary_email_address_id
    )?.email_address;

    if (!email) {
      return new Response("No primary email found for user", { status: 404 })
    }

    await UsersService.createUser({
      id: data.id,
      email: email,
      name: [data.first_name, data.last_name].filter(Boolean).join(" ") || "Unknown",
      metadata: data.public_metadata,
    });
  }

  return new Response("Webhook processed", { status: 200 });
}