'use client'

import React, { useRef, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BsPencil, BsTrash} from 'react-icons/bs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image';

export async function fetchGalleries(){

  if (typeof window !== 'undefined') {
    var currentURL = window.location.href;
    var urlParts = currentURL.split("/");
    var domain = urlParts[1];
  }

  const api = domain;

  try {
    const res = await fetch(`${api}/api/gallery`, {cache: 'no-store'});
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return [];
  }
}

export default function Galeri() {
  const [galleries, setGalleries] = useState([]);
  const { data: session, status } = useSession();
  const CLOUD_NAME = 'dqtnjtoby'
  const UPLOAD_PRESET = 'gunes_blog'

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/");
    }
  }, [status]);


  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchGalleries();
      setGalleries(data);
      setLoading(false)
      console.log(data)
    };
 
    fetchData();
  }, []);

  // Delete Word
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)

  const deletePhoto = async(id) => {
    if (typeof window !== 'undefined') {
      var currentURL = window.location.href;
      var urlParts = currentURL.split("/");
      var domain = urlParts[1];
    }
  
    const api = domain
    try {
        const confirmModal = confirm('Olum bah emin misin?')

        if(confirmModal){
          const response = await fetch(`${api}/api/gallery/${id}`, {
                headers: {
                    'Authorization': `Bearer ${session?.user?.accessToken}`
                },
                method: 'DELETE'
            })
            if(response.ok){
                router.push('/panel/galeri-yonetimi')
            }
        }
    } catch (error) {
        console.log(error)
    }
}
const form = useRef();


// add photo

const [title, setTitle] = useState('')
const [photo, setPhoto] = useState('')

const handleGallery = async (e) => {
  e.preventDefault()

  if(!photo || !title){
      toast.error("All fields are required")
      return
  }

  try {
    const imageUrl = await uploadImage()
    if (typeof window !== 'undefined') {
      var currentURL = window.location.href;
      var urlParts = currentURL.split("/");
      var domain = urlParts[1];
    }
  
    const api = domain;
    
    const res = await fetch(`${api}/api/gallery`, {
      headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${session?.user?.accessToken}` 
      },
      method: 'POST',
      body: JSON.stringify({title,imageUrl,authorId: session?.user?._id})
    })

    if(!res.ok){
      throw new Error("Error occured")
    }

  } catch (error) {
      console.log(error)
  }
}

const uploadImage = async () => {
  if (!photo) return

  const formData = new FormData()

  formData.append("file", photo)
  formData.append("upload_preset", UPLOAD_PRESET)

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData
    })

    const data = await res.json()

    const imageUrl = data['secure_url']
    form.current.reset();
    toast.success('Successfully registered');
    return imageUrl
  
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
        <h3 className='text-[#68C8B1] mt-1'>Galeri Yonetimi </h3>
        <hr />
        </div>
        <div>
        <div className='bg-[#202A40] mt-10 text-white flex flex-col justify-start items-center w-[90%] lg:w-[50%] mx-auto rounded-md shadow-lg py-4'>
      <h1 className='text-lg mb-4'>Fotograf Olustur</h1>
                <form ref={form} onSubmit={handleGallery}>
                    <input className='text-black block w-52 rounded-md pl-2' type="text" placeholder='Title...' onChange={(e) => setTitle(e.target.value)} />
                    <label className='block text-center w-52 mx-auto bg-white text-black rounded-md p-1 cursor-pointer my-4' htmlFor='image'>
                        Upload Image
                    </label>
                    <input id='image' type="file" style={{ display: 'none' }} onChange={(e) => setPhoto(e.target.files[0])} />
                    <button className='block mt-2 w-20 mx-auto bg-[#68C8B1] text-white p-1 rounded-md border-[1px] border-white'>Olustur</button>
                </form>
            </div>
            <ToastContainer />
        </div>
        
<div className='bg-[#202A40] mt-10 text-white flex flex-col justify-start items-center w-[90%] lg:w-[50%] mx-auto rounded-md shadow-lg py-4'>
  <div>
    <h1 className='text-xl mb-4'>Fotograflari Duzenle</h1>
  </div>
  {loading ? (
  <div>
    <div className="spinner"></div>
  </div>
) : (
  <div>
    {galleries.map((gallery) => (
      <div className='flex w-[100%] justify-evenly items-center gap-6 my-2 hover:border-[1px] hover:border-white hover:bg-[#35466a] px-10 py-2 rounded-md' key={gallery._id}>
        <Image src={gallery.imageUrl} alt='photo' width={100} height={100} />
        <p className=' lg:w-40 md:w-56 w-[60%] pl-4'>{gallery.title}</p>
        <Link href={`/panel/kelime-yonetimi/${gallery._id}`}>
          <p className=' cursor-pointer'>
            <BsPencil className=' text-[#68C8B1]' />
          </p>
        </Link>
        <p onClick={() => deletePhoto(gallery._id)} className=' cursor-pointer'>
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
