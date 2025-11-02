'use client'
import React from 'react'
import Image from "next/image";
import { useRouter } from 'next/navigation';


function Page() {
  const router = useRouter();


  const Subjects = [
    {
      subject_id: "550e8400-e29b-41d4-a716-446655440000",
      user_id: "11111111-1111-1111-1111-111111111111",
      date_created: "2025-10-02T00:00:00.000Z",
      subject_name: "Mgt 101"
    },
    {
      subject_id: "550e8400-e29b-41d4-a716-446655440001",
      user_id: "11111111-1111-1111-1111-111111111111",
      date_created: "2025-10-05T12:30:00.000Z",
      subject_name: "Math 201"
    },
    {
      subject_id: "550e8400-e29b-41d4-a716-446655440002",
      user_id: "11111111-1111-1111-1111-111111111111",
      date_created: "2025-09-28T09:15:00.000Z",
      subject_name: "Physics 101"
    },
    {
      subject_id: "550e8400-e29b-41d4-a716-446655440003",
      user_id: "11111111-1111-1111-1111-111111111111",
      date_created: "2025-10-01T14:45:00.000Z",
      subject_name: "Chemistry 102"
    },
    {
      subject_id: "550e8400-e29b-41d4-a716-446655440004",
      user_id: "11111111-1111-1111-1111-111111111111",
      date_created: "2025-10-03T08:00:00.000Z",
      subject_name: "History 101"
    },
    {
      subject_id: "550e8400-e29b-41d4-a716-446655440005",
      user_id: "11111111-1111-1111-1111-111111111111",
      date_created: "2025-10-06T16:20:00.000Z",
      subject_name: "Economics 101"
    }
  ];

  // Type-safe "time ago" function
  const timeAgo = (date: string): string => {
    const now = new Date().getTime();
    const past = new Date(date).getTime();
    const diff = now - past; // difference in ms

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years >= 1) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months >= 1) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (weeks >= 1) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (days >= 1) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours >= 1) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes >= 1) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'just now';
  };

  const enterNotebook = (val : string) => {
    router.push(`/main/notes/notes_with_content?subject_id=${val}`);
  }

  return (
    <div>
      {/* Nav section */}
      <div className='mx-30 mt-10'> 
        <div className='flex flex-row justify-between relative'>
          <div className='poppins-bold ml-8 border-b-3 px-3 border-[#71D285] w-min'>
            Notes
          </div>
          <button className='flex bg-[#71D285] gap-4 px-5 py-1 mb-4 rounded-2xl absolute right-0 top-[-30] items-center hover:bg-[#5eae6e]'>
            <Image 
              src='/main_notes_images/main_notes_plus.svg'
              alt='Plus Icon'
              width={20}
              height={20}
            />
            <div className='text-white'>
              add notes
            </div>
          </button>
        </div>
        <hr className='border-[#71D285]'></hr>
      </div>

      {/* Main content */}
      <div className='mx-30 gap-y-5 gap-x-10 justify-evenly flex flex-wrap mt-10'>
        {Subjects.map((subject) => (
          <button key={subject.subject_id} onClick={() => enterNotebook(subject.subject_id)}>
            <div className='hover:shadow-2xl shadow-[#71D285] h-65 w-75 border-2 border-[#71D285] rounded-4xl overflow-hidden'>
              {/* Upper part of card */}
              <div className='h-[35%] bg-[#71D285] relative'>
                <div className='text-white poppins-bold bottom-2 right-2 absolute'>
                  {timeAgo(subject.date_created)}
                </div>
              </div>

              {/* Lower part of card */}
              <div>
                <div className='mx-3 my-2'>
                  <div className='poppins-extrabold text-3xl text-[#3E6E48] flex'>
                    {subject.subject_name}
                  </div>
                </div>
              </div>
            </div>            
          </button>

        ))}
      </div>
    </div>
  )
}

export default Page;
