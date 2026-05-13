import { db } from "@/db";
import { users } from "@/db/schema/users/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await db.select().from(users);
  return NextResponse.json({ success: false }, { status: 401 });
}
