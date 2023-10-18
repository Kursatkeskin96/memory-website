'use client'

import { useRouter } from 'next/navigation'; // Use 'next/router' instead of 'next/navigation'
import React, { useRef, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function page() {

    const [kelime, setKelime] = useState('')
    const [desc, setDesc] = useState('')
    const kelimeForm = useRef();
  
    const handleKelime = async (e) => {
      e.preventDefault()
      kelimeForm.current.reset();
      if(!kelime || !desc){
          toast.error("All fields are required")
          return
      }
  
      try {
        if (typeof window !== 'undefined') {
          var currentURL = window.location.href;
          var urlParts = currentURL.split("/");
          var domain = urlParts[1];
        }
      
        const api = domain;
        const res = await fetch(`${api}/api/kelime`, {
          headers: {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${session?.user?.accessToken}` 
          },
          method: 'POST',
          body: JSON.stringify({kelime,desc,authorId: session?.user?._id})
        })
  
        if (res.ok) {
          toast.success('Kelime eklendi');
          return;
        } else {
          toast.error('Error while registering');
          return;
        }
      } catch (error) {
        // Handle the error
      }
    };
  return (
<div className='bg-[#F4F2DE] flex flex-col justify-center items-center w-[70%] mx-auto mt-10 mb-10 rounded-md shadow-lg py-4'>
  <div>
  <h1 className='text-lg mb-4'>Kelime Olustur</h1>
  </div>
      <form ref={kelimeForm} onSubmit={handleKelime}>
        <input className='rounded-md pl-2 block w-52 ' type="text" placeholder='Kelime' onChange={(e) => setKelime(e.target.value)} />
        <input className='rounded-md pl-2 block my-4 w-52 ' type="text" placeholder='Anlami' onChange={(e) => setDesc(e.target.value)} />
        <button className='block mt-2 w-20 mx-auto bg-[#C7D3D1] text-black p-1 rounded-md border-[1px] border-white' >Olustur</button>
      </form>
      </div>
  )
}
