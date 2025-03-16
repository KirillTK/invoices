import { db } from '~/server/db';
import { users } from '~/server/db/schema/schemas/users';

interface ClerkWebhookData {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email_addresses: Array<{
    email_address: string;
    id: string;
    verification: null | {
      status: string;
      strategy: string;
    };
  }>;
  primary_email_address_id: string;
  public_metadata: Record<string, unknown>;
}

export async function POST(req: Request) {
  const { type, data } = await req.json() as { type: string; data: ClerkWebhookData };

  console.log('Webhook received:', type, data);

  if (type === "user.created") {
    const email = data.email_addresses.find(
      email => email.id === data.primary_email_address_id
    )?.email_address;

    if (!email) {
      return new Response("No primary email found for user", { status: 404 })
    }

    await db.insert(users).values({
      id: data.id,
      email: email,
      name: [data.first_name, data.last_name].filter(Boolean).join(" ") || "Unknown",
      metadata: data.public_metadata,
    });
  }

  return new Response("Webhook processed", { status: 200 });
}