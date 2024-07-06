import AddArtwork from "@/components/AddArtwork";
import CustomizeDropDown from "@/components/CustomizeDropDown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

type CustomizeOptionsProps={
    title:string,
    items:string[]
}

const matOptions=["White Mat"];
const matWidths=["3"];

type ContentType={title:string,mat:boolean,options:CustomizeOptionsProps[]}
function Page() {
    let customizeOptions="withMat";//TODO Must implement a context here
    let content:ContentType={
        title:"Framed print with mat & glazing",
        mat:true,
        options:[{
            title:"Frame",
            items:["0.75inch black frame"]
        },{
            title:"Glazing",
            items:["Regular"]
        },{
            title:"Printing",
            items:["Photo Paper","Canvas"]
        },{
            title:"Backing",
            items:["Pine Mdf Hardboard"]
        }]
    }

    if(customizeOptions==="withoutMat"){
        content={
            title:"Framed print without mat and glazing",
            mat:false,
            options:[{
                title:"Frame",
                items:["0.75inch black frame"]
            },{
                title:"Printing",
                items:["Photo paper","Canvas"]
            },{
                title:"Streching",
                items:["Photo paper"]
            }]
        }
    } else if(customizeOptions==="printOnly"){
        content={
            title:"Print only",
            mat:false,
            options:[{
                title:"Printing",
                items:["Photo paper","Canvas"]
            }]
        }
    } else if(customizeOptions==="Stretched"){
        content={
            title:"Stretched canvas print",
            mat:false,
            options:[{
                title:"Printing",
                items:["Photo paper","Canvas"]
            },{
                title:"Stretching",
                items:["regular-0.75 inch thick"]
            },{
                title:"sides",
                items:["Image mirrored"]
            }]
        }
    }

    return (
        <section className="w-full flex justify-center">
            <div className="w-5/6 h-auto flex flex-col gap-5 lg:flex-row">
                <div className="w-[630px] h-[500px] bg-gray-2"/>
                <section className="flex flex-col gap-6">
                    <h1 className="font-semibold text-3xl leading-auto">{content.title}</h1>
                    <div className="flex flex-col gap-y-20">
                        <ul className="flex flex-col gap-y-8">
                            <a className="w-full flex justify-between items-center">
                                <p className="font-semibold">Image size</p>
                                <div className="flex gap-4 items-center">
                                    <Input className="w-[60px] h-[50px] border-gray-2 border-[1px] text-center" placeholder="0"/>
                                    <p>X</p>
                                    <Input className="w-[60px] h-[50px] border-gray-2 border-[1px] text-center" placeholder="0"/>
                                    <p className="font-semibold pr-2">In</p>
                                    <AddArtwork/>
                                </div>
                            </a>
                            {content.mat && 
                                <a className="flex flex-col gap-y-3 text-center">
                                    <div className="flex gap-x-20 justify-between items-center w-full">
                                        <p className="font-semibold">Mat</p>
                                        <div className="grid grid-cols-5 gap-x-4 w-full items-center">
                                           <a className="flex gap-x-2 items-center col-span-2">
                                            <p>Total width:</p>
                                            <CustomizeDropDown items={matWidths}/>
                                           </a>
                                            <a className="flex col-span-3 gap-x-2 items-center">
                                            <p>Top:</p>
                                            <CustomizeDropDown items={matOptions}/>
                                            </a>
                                        </div>
                                    </div>
                                    Add more mat
                                </a>
                            }
                            <a className="flex flex-col gap-y-8">
                                {content.options.map((option,index)=>{
                                    return (
                                        <div key={index} className="w-full flex gap-x-20  justify-between items-center">
                                        <p className="font-semibold">{option.title}</p>
                                        <CustomizeDropDown items={option.items}/>
                                        </div>
                                    );
                                })}
                            </a>
                            <a className="flex gap-x-20">
                                <p className="font-semibold">Total Size</p>
                                <div className="flex gap-x-2">
                                    <p>13</p>
                                    <p>X</p>
                                    <p>13</p>
                                    <p className="font-semibold">In</p>
                                </div>
                            </a>
                        </ul>
                        <div className="flex gap-x-14 w-full">
                            <div className="flex gap-x-10">
                                <p className="font-semibold">Price</p>
                                <h1 className="font-bold text-3xl w-[148px]">$ 2,00.00</h1>
                            </div>
                            <div className="max-w-[325px]">
                                <Button size={"lg"} className="max-w-[325px]">Add to Cart</Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
}

export default Page;
