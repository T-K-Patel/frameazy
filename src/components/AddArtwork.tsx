import React from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import Upload from "../assets/upload.svg"
import Image from 'next/image'

const AddArtwork = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <p className='bg-white border-blue-1 border-[1px] py-3 text-black hover:bg-blue-1/20 md:'>Add Artwork</p>
      </DialogTrigger>
      <DialogContent className='w-[335px] h-[494px] md:p-[48px] flex flex-col gap-y-[32px] md:w-[676px] md:h-[750px] items-center'>
        <div className='absolute w-[287.43px] h-[335.36px] top-[51.54px] left-[23.79px] flex flex-col gap-y-[19.82px] md:fixed md:w-[580px] md:h-auto md:gap-y-[40px]'>
          <div className='w-full h-[91.96px] flex flex-col gap-y-[3.96px] md:h-auto md:gap-y-[8px]'>
            <div className='w-auto h-[24px] font-semibold leading-[24px] md:h-[48px] md:text-3xl/[32px] md:leading-[48px]'>
              Add Artwork
            </div>
            <div className='w-full h-[64px] text-xs/[10px] leading-[16px] md:h-auto md:leading-[25.6px]'>
              We offer you the flexibility to add artwork in a way that suits your preferences. Whether you have a direct link to the piece you want to frame or wish to browse through our system.
            </div>
          </div>
          <div className='w-full h-[233.57px] flex flex-col gap-y-[16px] md:h-[423px] md:gap-y-[32px]'>
            <div className='w-full h-[61.96px] flex flex-col gap-y-[8px] md:h-[98px] md:gap-y-[16px]'>
              <div className='w-auto h-[18px] font-semibold text-xs leading-[18px] md:h-[30px] md:text-xl md:leading-[30px]'>
                Link to Artwork
              </div>
              <Input className='w-full h-[40px] rounded-[6px] border-[0.5px] border-gray-2 md:h-[60px] md:rounded-[12px] md:border-[1px] md:w-[580px]' placeholder='https://www.shutterstock.com/image-illustration' />
            </div>
            <div className='w-full h-[15px] flex gap-x-[8px] justify-center md:h-[30px]'>
              <div className='w-auto h-full font-semibold text-xs/[9.91px] leading-[15px] md:text-xl md:leading-[30px]'>
                or
              </div>
            </div>
            <div className='w-full h-[114.61px] flex flex-col gap-y-[8px] md:h-[231px] md:gap-y-[16px]'>
              <div className='w-auto h-[15px] font-semibold align-middle text-xs/[10px] leading-[15px] md:h-[30px] md:text-xl md:leading-[30px]'>
                Add Artwork
              </div>
              <Image src={Upload} alt="upload" className="w-full h-[91.68px] md:h-[185px]" />
            </div>
          </div>
          <Button size="md" className='w-full h-[40px] rounded-[12px] border-[1px] font-semibold text-xl leading-[30px] md:h-[60px] '>Add</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddArtwork
