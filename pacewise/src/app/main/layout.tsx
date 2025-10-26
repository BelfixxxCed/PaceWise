import React from 'react'
import Header from '../../components/dashboard/header'
import Sidebar from '../../components/dashboard/sidebar'

function layout({
    children
}: {
    children : React.ReactNode
}) {
  return (
    <div className='flex w-[100%]'>
        {/* This is for the left side */}
        <div className='w-[5%] h-screen'>
            <Sidebar/>
        </div>

        {/* This is for the content and the header part */}
        <div className='flex-2'>

            {/* This is the header */}
            <div>
                <Header/>
            </div>

            {/* This is the children part */}
            <div>
              {children}
            </div>
        </div>
    </div>
  )
}

export default layout