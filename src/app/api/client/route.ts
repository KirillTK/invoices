import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getClients } from "~/server/clients";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await getClients(user.id));
}
