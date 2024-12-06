import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type FramesForCustomizationType = {
	id: string;
	name: string;
	borderSrc: string;
	varients: {
		borderWidth: number;
		unit_price: number;
	}[];
};


export async function GET(){

    try{
    
    const frames :  FramesForCustomizationType[] = await db.frame.findMany({

        select: {
            id: true,
            name: true,
            borderSrc: true,
            varients: true,
        },
    });

    return NextResponse.json({success: true,data : frames}, { status: 200 });
}catch (error) {
    console.error("Error fetching frames:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" },{ status: 500 });
  }
}

