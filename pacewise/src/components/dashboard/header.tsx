'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';


function header() {

    const [title, setTitle] = useState("Dashboard")
    const path = usePathname();


    const title_decide = () => {
        if (path == '/dashboard/notes'){
            setTitle("Notes");
        } else if (path == "/dashboard/study_schedule"){
            setTitle("Study Schedule");
        } else if (path == "/dashboard/practice_test"){
            setTitle("Practice Test");
        }

    }

    useEffect(() => {
        title_decide();
    }, [])

  return (
    <div className='flex flex-row justify-between h-20 p-5 shadow-sm shadow-gray-150 items-center'>
        <div className='poppins-bold text-2xl ml-15'>
            {title}
        </div>
        <div>
            <ul className='flex flex-row items-center gap-4'>
                <li className='poppins-semibold'>
                    Firstname Lastname
                </li>
                <li>
                    {/* Insert profile pic here */}
                    <div className='h-10 w-10 bg-[#71D285] rounded-full'>
                    </div>
                </li>
            </ul>
        </div>
    </div>
  )
}

export default header