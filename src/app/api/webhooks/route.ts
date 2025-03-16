import { db } from '~/server/db';


export async function POST(req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
  const { type, data } = await req.json() as { type: string, data: any };


  console.log(type, data);

  if (type === "user.created") {
    console.log("user.created", data);
    // await db.insert(users).values({
    //   id: data.id,
    //   email: data.email_addresses[0]?.email_address,
    //   name: data.first_name + " " + data.last_name,
    //   metadata: data.public_metadata,
    // });
  }

  return new Response("Webhook processed");
}