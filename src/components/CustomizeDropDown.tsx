import React from 'react'
import { RiArrowDropDownLine } from "react-icons/ri";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

const CustomizeDropDown = ({items}:{items:string[]}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`flex px-2 justify-between h-[60px] w-full rounded-lg overflow-hidden border-gray-2 border-[1px] items-center`}>
        <p>{items[0]}</p>
        <RiArrowDropDownLine size={24}/>
        <DropdownMenuContent>
          {items.map((item,index) => (
            <DropdownMenuItem key={index} asChild>{item}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenuTrigger>
    </DropdownMenu>
  )
}

export default CustomizeDropDown
