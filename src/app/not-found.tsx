import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react'

function NotFound() {
    return (
        <div className='flex flex-col w-full items-center gap-3 justify-center p-5'>
            <h1 className='text-2xl'>Bhai kya kar raha hai.</h1>
            <h1 className='text-xl'>Yaha kuch nahi rakha, wapas chala jaa</h1>
            <Link href={"/"}>
                <Button size={'sm'} className='p-1'>Mujhe ghar jana hai</Button>
            </Link>
        </div>
    )
}

export default NotFound;