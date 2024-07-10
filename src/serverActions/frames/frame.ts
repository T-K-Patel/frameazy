"use server"

import { Category, Collection, Color, Frame } from "@prisma/client"
import { db } from "../../../prisma/db"

type Filter = {
    category?: Category,
    collection?: Collection,
    width?: number,
    height?: number,
    color?: Color
}

type framesReturnType =
    | {
          error: string;
          success: false;
      }
    | {
          success: true;
          frames:any
      };

export async function getFramesDetailed(filters: Partial<Filter>[]):Promise<framesReturnType>{
    try {
        const categories: Category[] = filters
        .map(filter => filter.category)
        .filter((category): category is Category => !!category);

        const collections: Collection[] = filters
            .map(filter => filter.collection)
            .filter((collection): collection is Collection => !!collection);

        const widths: number[] = filters
            .map(filter => filter.width)
            .filter((width): width is number => typeof width === 'number');

        const heights: number[] = filters
            .map(filter => filter.height)
            .filter((height): height is number => typeof height === 'number');

        const colors: Color[] = filters
            .map(filter => filter.color)
            .filter((color): color is Color => !!color);

        const frames = await db.frame.findMany({
            where: {
                ...(categories.length > 0 && { category: { in: categories } }),
                ...(collections.length > 0 && { collection: { in: collections } }),
                ...(widths.length > 0 && { width: { in: widths } }),
                ...(heights.length > 0 && { height: { in: heights } }),
                ...(colors.length > 0 && { color: { in: colors } }),
            }
        });

        return {success:true,frames};
    } catch (error) {
        return {error:"Something went wrong",success:false}
    }
}

export async function getFrame(filter:Partial<Filter>):Promise<framesReturnType>{
    try {
        const frame = await db.frame.findFirst({
            where: {
                ...(filter.category && { category: filter.category }),
                ...(filter.collection && { collection: filter.collection }),
                ...(filter.width && { width: filter.width }),
                ...(filter.height && { height: filter.height }),
                ...(filter.color && { color: filter.color }),
            },
            select:{
                id:true,
                name:true,
                image:true
            }
        });
    
        return {success:true,frames:frame};
    } catch (error) {
        return {error:"Something went wrong",success:false}
    }
}

export async function popularFrames():Promise<framesReturnType>{
    try {
        const frames=await db.frame.findMany({
            take:9,
            orderBy:{
                OrderItem:{
                    _count:'desc'
                }
            },
            select:{
                id:true,
                name:true,
                price:true,
                image:true
            }
        });
        return {success:true,frames};
    } catch (error) {
       return {error:"Something went wrong",success:false} 
    }
}
