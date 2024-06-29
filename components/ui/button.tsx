import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-white bg-blue-1 rounded-[12px] overflow-hidden flex gap-x-3 border-white border-1 hover:bg-blue-1/80",
        light:"text-black bg-white rounded-[12px] overflow-hidden flex gap-x-3 border-black border-1",
      },
      size: {
        default: "w-[325px] h-[60px] px-6 py-10 md:[425px]",
        sm:"w-[197.11px] h-[60px] px-6 py-10 md:[259.11px]",
        md:"w-[223.11px] h-[60px] px-6 py-8",
        lg:"w-[335px] h-[60px] px-3 py-5",
        smm:"w-[123.62px] h-[32px] rounded-[7.42px] overflow-hidden",
        icon:"w-[66px] h-[48px] rounded-[9.73px] overflow-hidden p-[12.17px] flex justify-center md:w-[60px] md:h-[44px] md:p-[10.97px]"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
