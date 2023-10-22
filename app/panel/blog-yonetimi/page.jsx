'use client'

import React, { useRef, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BsPencil, BsTrash} from 'react-icons/bs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export async function fetchBlogs(){


  if (typeof window !== 'undefined') {
    var currentURL = window.location.href;
    var urlParts = currentURL.split("/");
    var domain = urlParts[1];
  }

  const api = domain;

  try {
    const res = await fetch(`${api}/api/blog`, {cache: 'no-store'});
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return [];
  }
}

export default function KullaniciYonetimi() {
    const { data: session, status } = useSession();
    useEffect(() => {
        if (session?.user?.role ==! "admin") {
          redirect("/");
        }
      }, [status]);
    
  
  // Get Blogs

  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    const fetchData = async () => {  // Renamed to "fetchData"
      const data = await fetchBlogs();  
      setBlogs(data);
      setLoading(false);
      console.log(data)
    };
    fetchData();  // Call the renamed function
  }, []);

  // Delete User 
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)

  const deleteUser = async(id) => {
    if (typeof window !== 'undefined') {
      var currentURL = window.location.href;
      var urlParts = currentURL.split("/");
      var domain = urlParts[1];
    }
  
    const api = domain
    try {
        const confirmModal = confirm('Olum bah emin misin?')

        if(confirmModal){
          const response = await fetch(`${api}/api/users/${id}`, {
                headers: {
                    'Authorization': `Bearer ${session?.user?.accessToken}`
                },
                method: 'DELETE'
            })
            if(response.ok){
                router.push('/panel')
            }
        }
    } catch (error) {
        console.log(error)
    }
}



// loading state
const [loading, setLoading] = useState(true);

  return (
    <div className='bg-[#141B2D] pb-10 min-h-screen'>
      <div className='flex-col p-10'>
        <h1 className='text-white text-3xl uppercase'>Admin paneli</h1>
        <h3 className='text-[#68C8B1] mt-1'>Kullanici Yonetimi </h3>
        <hr />
        </div>
<div className='bg-[#202A40] mt-10 text-white flex flex-col justify-start items-center w-[90%] lg:w-[50%] mx-auto rounded-md shadow-lg py-4'>
  <div>
    <h1 className='text-xl mb-4'>Bloglari Duzenle</h1>
  </div>
  {loading ? (
  <div>
    <div className="spinner"></div>
  </div>
) : (
  <div>
    {blogs.map((blog) => (
      <div className='flex w-[100%] justify-evenly items-center gap-6 my-2 hover:border-[1px] hover:border-white hover:bg-[#35466a] px-10 py-2 rounded-md' key={blog._id}>
        <p className=' lg:w-72 md:w-56 w-[60%] pl-4'>{blog.title}</p>
        <p className=' lg:w-40 md:w-56 w-[60%] pl-4'>{blog.authorId.username}</p>
        <Link href={`/panel/blog-yonetimi/${blog._id}`}>
          <p className=' cursor-pointer'>
            <BsPencil className=' text-[#68C8B1]' />
          </p>
        </Link>
        <p onClick={() => deleteUser(user._id)} className=' cursor-pointer'>
          <BsTrash className=' text-red-600' />
        </p>
      </div>
    ))}
  </div>
)}

  </div>
</div>
  )
}
