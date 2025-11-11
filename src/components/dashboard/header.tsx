'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import supabase from '@/supabase/supabase_client';


function header() {

    const [title, setTitle] = useState("Dashboard")
    const path = usePathname();
    const router = useRouter();

    const title_decide = () => {
        if (path == '/main/notes'){
            setTitle("Notes");
        } else if (path == "/main/study_schedule"){
            setTitle("Study Schedule");
        } else if (path == "/main/practice_test"){
            setTitle("Practice Test");
        }

    }

    const verifyUser = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        console.log("There was an error checking your authorization:", error.message);
        alert("There was an error checking your authorization.");
        router.push("/landing");
        return;
    }

    if (!data.user || data.user.aud !== "authenticated") {
        router.push("/landing");
        return;
    }

    console.log("User:", data.user);
    };



    useEffect(() => {
        title_decide();
        verifyUser();
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