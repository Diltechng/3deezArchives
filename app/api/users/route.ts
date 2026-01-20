import { db } from "@/db";
import { users } from "@/db/schema";
import { varchar } from "drizzle-orm/mysql-core";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { and, eq } from "drizzle-orm";

    interface Body {
        name : string,
        phone: string,
        password: string,
        email: string,
    }

export async function GET() {
  const user = await db.select().from(users);
  return NextResponse.json(user, { status: 200 });
}



export async function POST(req: NextRequest) {
  try {
    
    const {name,password,email,phone}: Body = await req.json();
    //hashing password
    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);
       const check = await db.select()
       .from(users)
       .where(and( eq(users.email, email), eq(users.phone, phone))).limit(1)

       if(check.length > 0)  throw new Error('email or phone number already exist')
    //insert query
          const [user] = await db
          .insert(users)
          .values({
            name:name , 
            phone: phone ,
            email: email, 
            password: String(hashedPassword)})
          .returning();
          //checking
   if(user){
        const { id, password, ...safeUser } = user;
        return NextResponse.json({ message: "success" , data : safeUser})
   }
    throw new Error('failed to create user')
   ;
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}
