import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
){

    try {
        const {id} = await params

        const user = await db
        .select()
        .from(users)
        .where( eq(users.id, id) )
        
        return NextResponse.json({result : user });

    } catch (error : any) {
         return NextResponse.json({message : error.message });
    }
    
}

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
){
    const {id} = await params
    const body = await _req.json();
    try {
        const user = await db
    .update(users)
    .set({
      ...body,
      updatedAt: new Date(), // always update timestamp
    })
    .where(eq(users.id, id))

    return NextResponse.json({message : "success" });
    } catch (error : any) {
         return NextResponse.json({message : error.message });
    }
    
    
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
){
    const {id} = await params
    const body = await _req.json();
    try {
         const user = await db
    .delete(users)
    .where(eq(users.id, id))

    return NextResponse.json({message : "success" });
    } catch (error : any) {
         return NextResponse.json({message : error.message });
    }
     
}