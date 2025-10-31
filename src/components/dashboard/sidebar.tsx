"use client";
import React from 'react'
import Image from 'next/image'
import { 
  useEffect,
  useState
} from 'react';
import { usePathname } from 'next/navigation';


function Sidebar() {

    const [title, setTitle] = useState(0)
    const path = usePathname();


    const title_decide = () => {
        if (path == '/Main/notes'){
            setTitle(2);
        } else if (path == "/Main/study_schedule"){
            setTitle(1);
        } else if (path == "/Main/practice_test"){
            setTitle(3);
        }

    }

    useEffect(() => {
        title_decide();
    }, [])

  return (
    <div className='fixed left-0 top-0 h-screen w-20 hover:w-64 bg-[#71D285] z-50 group flex flex-col justify-between transition-all duration-300 ease-in-out'>
      {/* This is for the upper sections */}
      <div className='flex flex-col items-center pt-6'>
        <div className='flex items-center px-4 w-full'>
          <div className='w-10 h-10 flex items-center justify-center flex-shrink-0'>
            <Image 
              src={'/reusable_ui_images/pacewise_logo.svg'} 
              alt='pacewise logo' 
              width={40} 
              height={40}
              className='flex-shrink-0'
            />
          </div>

          <div className='poppins-bold text-2xl text-white ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden'>
            PaceWise
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 w-full px-2">
          <a href="/Main/dashboard" className={`rounded-lg transition-all duration-200 py-2 px-3 ${title == 0 ? "bg-[#E9F5FE] font-bold" : "hover:bg-[#E9F5FE] hover:font-bold"}  flex items-center gap-3 font-normal  group/item`}>
            <div className='w-10 h-10 flex items-center justify-center flex-shrink-0'>
              <Image 
                src="/reusable_ui_images/dashboard.svg" 
                alt="dashboard page button" 
                width={40} 
                height={40}
                className='object-contain'
              />
            </div>
            <p className="text-[#3E6E48] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
              Dashboard
            </p>
          </a>

          <a href="/Main/study_schedule" className={`${title == 1 ? "bg-[#E9F5FE] font-bold" : "hover:bg-[#E9F5FE] hover:font-bold"} rounded-lg transition-all duration-200 py-2 px-3 hover:bg-[#E9F5FE] flex items-center gap-3 font-normal hover:font-bold group/item`}>
            <div className='w-10 h-10 flex items-center justify-center flex-shrink-0'>
              <Image 
                src="/reusable_ui_images/study_schedule.svg" 
                alt="study schedule button" 
                width={40} 
                height={40}
                className='object-contain'
              />
            </div>
            <p className="text-[#3E6E48] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
              Study Schedule
            </p>
          </a>

          <a href="/Main/notes" className={`${title == 2 ? "bg-[#E9F5FE] font-bold" : "hover:bg-[#E9F5FE] hover:font-bold"} rounded-lg transition-all duration-200 py-2 px-3 hover:bg-[#E9F5FE] flex items-center gap-3 font-normal hover:font-bold group/item`}>
            <div className='w-10 h-10 flex items-center justify-center flex-shrink-0'>
              <Image 
                src="/reusable_ui_images/notes.svg" 
                alt="notes button" 
                width={23} 
                height={23}
                className='object-contain'
              />
            </div>
            <p className="text-[#3E6E48] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
              Notes
            </p>
          </a>

          <a href="/Main/practice_test" className={`${title == 3 ? "bg-[#E9F5FE] font-bold" : "hover:bg-[#E9F5FE] hover:font-bold"} rounded-lg transition-all duration-200 py-2 px-3 hover:bg-[#E9F5FE] flex items-center gap-3 font-normal hover:font-bold group/item`}>
            <div className='w-10 h-10 flex items-center justify-center flex-shrink-0'>
              <Image 
                src="/reusable_ui_images/practice_test.svg" 
                alt="practice test button" 
                width={29} 
                height={29}
                className='object-contain'
              />
            </div>
            <p className="text-[#3E6E48] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
              Practice Test
            </p>
          </a>
        </div>
      </div>
      
      {/* This is for the logout button */}
      <div className='mb-5 mx-2 rounded-md bg-[#3E6E48] hover:bg-[#5d9068] flex items-center py-2 px-3 cursor-pointer transition-colors duration-200'>
        <div className='w-10 h-10 flex items-center justify-center flex-shrink-0'>
          <Image 
            src={'/reusable_ui_images/logout.svg'} 
            width={40} 
            height={40} 
            alt='logout button'
            className='object-contain'
          />
        </div>

        <div className='text-white poppins-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden ml-2'>
          Logout
        </div>
      </div>
    </div>
  )
}

export default Sidebar