'use client'
import React, { useState, useEffect } from 'react'
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/ui/pagination';
import { GET_subjects } from '@/components/notes/notes_page_supabase_queries';
import LoadingModal from '@/components/loading_modal';

type Subject = {
  subject_id: string;
  subject_name: string;
  date_created: string;
};

function Page() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

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

  
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(Subjects.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSubjects = subjects.slice(startIndex, endIndex);

  
  const getData = async () => {
    const data = await GET_subjects();
    setSubjects(data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
    
    getData();
  }, [currentPage, totalPages]);

  const enterNotebook = (val : string) => {
    router.push(`/main/notes/notes_with_content?subject_id=${val}`);
  }

  if(loading){
    return <LoadingModal message='Loading your subjects...' />
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
            <a href='/main/schedule#:~:text=%3A00%20AM-,Add%20Subject,-from'>
              <div className='text-white'>
                add notes
              </div>              
            </a>

          </button>
        </div>
        <hr className='border-[#71D285]'></hr>
      </div>

      {/* Main content */}
      <div className='mx-30 gap-y-5 gap-x-10 justify-evenly flex flex-wrap mt-10'>
        {paginatedSubjects.map((subject) => (
          <button key={subject.subject_id} onClick={() => enterNotebook(subject.subject_id)}>
            <div className='hover:shadow-2xl shadow-[#71D285] h-65 w-75 border-2 border-[#71D285] rounded-4xl overflow-hidden'>
              {/* Upper part of card */}
              <div className='h-[35%] bg-[#71D285] relative'>
                <div className='text-white poppins-bold bottom-2 right-2 absolute'>
                  {subject.date_created}
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

     
      <div className="h-20" />

      
      <div className="fixed left-0 right-0 bottom-0 flex justify-center z-50 pointer-events-none">
        <div className="mx-30 w-full flex justify-center pointer-events-auto">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  )
}

export default Page;
