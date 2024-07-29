import CustomizeDropDown from '@/app/customize/CustomizeDropDown'
import { CartItem } from '@prisma/client'
import React from 'react'
const Item=({item}:{item:CartItem})=>{
    return (
        <div className='flex flex-col gap-y-2 md:flex-row items-center justify-between'>
           <div className='flex items-center justify-between md:gap-8'>
               <div className='w-16 h-full rounded-xl overflow-hidden bg-gray-2'/>
                
            </div> 
        </div>
    )
}
const OrderDetails = ({params}:{params:{id:string}}) => {
    return (
        <div className='w-11/12 max-w-screen-2xl mx-auto flex flex-col gap-4 md:gap-8'>
            <section className='rounded-2xl border border-[#F1F1F1] md:px-4 md:py-6 p-2 flex flex-col gap-2 md:gap-5'>
                <h1 className='font-semibold md:text-3xl leading-3 md:leading-12 border-b border-[#F1F1F1] pb-2'>Update Order Status</h1>
                <CustomizeDropDown  items={["Pending","Shipped","Delivered"]}/>
            </section>
            <section className='rounded-2xl border border-[#F1F1F1] px-4 py-6 flex flex-col gap-5'>
                <h1 className='font-semibold text-3xl leading-12 border-b border-[#F1F1F1] pb-2'>Order Items</h1>
                <div className='flex flex-col gap-4'>

                </div>
            </section>
            <section className='rounded-2xl border border-[#F1F1F1] px-4 py-6 flex flex-col gap-5'>
                <h1 className='font-semibold text-3xl leading-12 border-b border-[#F1F1F1] pb-2'>Update Order Status</h1>
                <CustomizeDropDown  items={["Pending","Shipped","Delivered"]}/>
            </section>
        </div>
    )
}

export default OrderDetails