import React from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'

const Checkbox = ({title}:{title:string}) => {
  return (
    <a className='flex gap-x-2 pb-1 justify-start'>
        <Input type='checkbox' className='min-w-[16px] max-w-[16px] h-[20px] mt-[3px] bg-[#E6E6E6] border-[#B3B3B3] border-[1px]'/>
        <Label  className='font-normal leading-4 mt-1'>{title}</Label>
    </a>
  )
}

export default Checkbox
