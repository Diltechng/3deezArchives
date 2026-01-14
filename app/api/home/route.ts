import { db } from "@/db";
import { users } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await db.select().from(users);
  return NextResponse.json(user, { status: 200 });
}
