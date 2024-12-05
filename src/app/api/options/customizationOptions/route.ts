import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    let models = ["mirror","sides","stretching","backing","printing","glazing"];
   
    const resp = {
        
    } as {[key:string]:any[]}

   await Promise.all(models.map(async (option : any) => {
        if(req.nextUrl.searchParams.get(option) === "true"){
           resp[option] = await (db[option] as any).findMany();
        }
        
    }));

    return NextResponse.json(resp, { status: 200 });

}
    
