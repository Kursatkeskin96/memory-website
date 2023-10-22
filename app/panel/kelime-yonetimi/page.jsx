'use client'

import React, { useRef, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BsPencil, BsTrash} from 'react-icons/bs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export async function fetchWords(){

  if (typeof window !== 'undefined') {
    var currentURL = window.location.href;
    var urlParts = currentURL.split("/");
    var domain = urlParts[1];
  }

  const api = domain;
  const res = await fetch(`${api}/api/kelime`, {cache: 'no-store'})
  return res.json()
}


export default function KelimeYonetimi() {
    const { data: session, status } = useSession();
    useEffect(() => {
        if (session?.user?.role ==! "admin") {
          redirect("/");
        }
      }, [status]);
    
  
  // Get Words

  const [words, setWords] = useState([])

  useEffect(() => {
    const fetchData = async () => {  // Renamed to "fetchData"
      const data = await fetchWords();  
      setWords(data);
      setLoading(false);
    };
    fetchData();  // Call the renamed function
  }, []);

  // Delete Word
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)

  const deleteWord = async(id) => {
    if (typeof window !== 'undefined') {
      var currentURL = window.location.href;
      var urlParts = currentURL.split("/");
      var domain = urlParts[1];
    }
  
    const api = domain
    try {
        const confirmModal = confirm('Olum bah emin misin?')

        if(confirmModal){
          const response = await fetch(`${api}/api/kelime/${id}`, {
                headers: {
                    'Authorization': `Bearer ${session?.user?.accessToken}`
                },
                method: 'DELETE'
            })
            if(response.ok){
                router.push('/panel/kelime-yonetimi')
            }
        }
    } catch (error) {
        console.log(error)
    }
}
const form = useRef();
// add word

const [kelime, setKelime] = useState('')
const [desc, setDesc] = useState('')

const handleKelime = async (e) => {
  e.preventDefault()

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
      toast.success('Successfully registered');
      form.current.reset();
      return;
    } else {
      toast.error('Error while registering');
      return;
    }
  } catch (error) {
    // Handle the error
  }
};

// loading state
const [loading, setLoading] = useState(true);

  return (
    <div className='bg-[#141B2D] pb-10 min-h-screen'>
      <div className='flex-col p-10'>
        <h1 className='text-white text-3xl uppercase'>Admin paneli</h1>
        <h3 className='text-[#68C8B1] mt-1'>Kelime Yonetimi </h3>
        <hr />
        </div>
        <div className='bg-[#202A40] mt-10 text-white flex flex-col justify-start items-center w-[90%] lg:w-[50%] mx-auto rounded-md shadow-lg py-4'>
  <div>
  <h1 className='text-lg mb-4'>Kelime Olustur</h1>
  </div>
      <form ref={form} onSubmit={handleKelime}>
        <input className='rounded-md pl-2 block w-52 ' type="text" placeholder='Kelime' onChange={(e) => setKelime(e.target.value)} />
        <input className='rounded-md pl-2 block my-4 w-52 ' type="text" placeholder='Anlami' onChange={(e) => setDesc(e.target.value)} />
        <button className='block mt-2 w-20 mx-auto bg-[#68C8B1] text-white p-1 rounded-md border-[1px] border-white' >Olustur</button>
      </form>
      </div>
        
<div className='bg-[#202A40] mt-10 text-white flex flex-col justify-start items-center w-[90%] lg:w-[50%] mx-auto rounded-md shadow-lg py-4'>
  <div>
    <h1 className='text-xl mb-4'>Kelimeleri Duzenle</h1>
  </div>
  {loading ? (
  <div>
    <div className="spinner"></div>
  </div>
) : (
  <div>
    {words.map((word) => (
      <div className='flex w-[100%] justify-evenly items-center gap-6 my-2 hover:border-[1px] hover:border-white hover:bg-[#35466a] px-10 py-2 rounded-md' key={word._id}>
        <p className=' lg:w-72 md:w-56 w-[60%] pl-4'>{word.kelime}</p>
        <p className=' lg:w-40 md:w-56 w-[60%] pl-4'>{word.desc}</p>
        <Link href={`/panel/kelime-yonetimi/${word._id}`}>
          <p className=' cursor-pointer'>
            <BsPencil className=' text-[#68C8B1]' />
          </p>
        </Link>
        <p onClick={() => deleteWord(word._id)} className=' cursor-pointer'>
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
