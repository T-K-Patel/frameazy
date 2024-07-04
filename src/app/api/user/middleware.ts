import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function middleware(){
    const session=await getServerSession(authOptions);
    if(session?.user){
        return NextResponse.next();
        }
    else{
        console.log("please login");
        return NextResponse.json({
            message:"User not authenticated"
        },{status:403});
    } 
}

export const config = {
    matcher: '/user/:path*',
  }