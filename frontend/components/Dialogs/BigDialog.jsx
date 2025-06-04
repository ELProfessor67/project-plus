import { X } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

const BigDialog = ({onClose,children,open,width=50}) => {
  return (
    <div className='absolute top-0 left-0 right-0 bottom-0 overflow-y-auto z-50 p-5 bg-black/10 transition-all' hidden={!open}>
        <div className={`bg-secondary shadow-sm rounded-md min-h-[35rem] mx-auto mt-10 p-4 relative border border-primary`} style={{maxWidth: `${width}rem`}}>
            <div className='flex items-center justify-end'>
                <Button 
                    className="bg-transparent hover:bg-tbutton-bg text-foreground-primary hover:text-tbutton-text transition-all" 
                    onClick={onClose}
                >
                    <X />
                </Button>
            </div>
            <div className=''>
                {children}
            </div>
        </div>
    </div>
  )
}

export default BigDialog
