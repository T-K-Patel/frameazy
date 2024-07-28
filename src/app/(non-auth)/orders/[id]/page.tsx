import React from 'react'

const OrderDetails = ({params}:{params:{id:string}}) => {
    const order:any={};//TODO server action for fetcching the order by giving the id
  return (
    <div className='w-11/12 max-w-screen-2xl mx-auto flex flex-col gap-4'>
      <section className='rounded-lg border border-[#F1F1F1] p-3 flex flex-col gap-2'>
        <p className='border-b border-[#F1F1F1] font-semibold leading-6'>Order Items</p>
        <ul className='border-b border-[#F1F1F1] flex flex-col gap-2'>
            
        </ul>
        <div className='flex flex-col gap-2 border-b border-[#F1F1F1]'>
            <div className="grid grid-cols-2 gap-x-2">
                <p className="font-semibold text-sm leading-5 text-[#A3A1A1]">Discount</p>
                <p className={`font-semibold leading-6 ${order.paymentStatus==="Pending"?"text-[#D68D00]":"text-[#008C0E]"}`}>{order.paymentStatus}</p>
            </div>
            <div className="grid grid-cols-2 gap-x-2">
                <p className="font-semibold text-sm leading-5 text-[#A3A1A1]">Discount</p>
                <p className={`font-semibold leading-6 ${order.paymentStatus==="Pending"?"text-[#D68D00]":"text-[#008C0E]"}`}>{order.paymentStatus}</p>
            </div>
            <div className="grid grid-cols-2 gap-x-2">
                <p className="font-semibold text-sm leading-5 text-[#A3A1A1]">Discount</p>
                <p className={`font-semibold leading-6 ${order.paymentStatus==="Pending"?"text-[#D68D00]":"text-[#008C0E]"}`}>{order.paymentStatus}</p>
            </div>
        </div>
      </section>
    </div>
  )
}

export default OrderDetails