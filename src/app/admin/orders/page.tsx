import { Order } from '@/components/Order'
import React from 'react'

const AdminOrdersPage = () => {
  return (
    <div className="mx-auto w-11/12 max-w-screen-2xl flex flex-col gap-y-12 py-12">
       <section className="w-11/12 rounded-5 flex flex-col gap-6">
            <h1 className="font-semibold text-3xl leading-12">Orders</h1>
            <Order order={{id:"1234",price:1000,date:new Date(),deliveryDate:new Date(),orderStatus:"Shipped",paymentStatus:"Pending"}}/>
        </section>
    </div>
  )
}

export default AdminOrdersPage
