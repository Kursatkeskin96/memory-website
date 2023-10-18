'use client'

import { useRouter } from 'next/navigation'; // Use 'next/router' instead of 'next/navigation'
import React, { useRef, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import {Chart as ChartJS} from 'chart.js/auto';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import Link from 'next/link';
import {AiOutlineUser} from 'react-icons/ai'
import {FaPencilAlt} from 'react-icons/fa'
import {HiPhotograph} from 'react-icons/hi'
import {BsFillChatTextFill} from 'react-icons/bs'

export default function page() {

    const CLOUD_NAME = 'dqtnjtoby'
  const UPLOAD_PRESET = 'gunes_blog'
  const galleryForm = useRef();
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
    galleryForm.current.reset();
    toast.success('Fotograf galeriye eklendi.');
    return imageUrl
  
  } catch (error) {
      console.log(error)
  }
}

  return (
    <div>
    <div className='bg-[#F4F2DE] flex flex-col justify-center items-center w-[70%] mx-auto mt-10 mb-10 rounded-md shadow-lg py-4'>
    <h1 className='text-lg mb-4'>Fotograf Olustur</h1>
              <form ref={galleryForm} onSubmit={handleGallery}>
                  <input className='block w-52 rounded-md pl-2' type="text" placeholder='Title...' onChange={(e) => setTitle(e.target.value)} />
                  <label className='block text-center w-32 mx-auto bg-[#E9B384] text-white rounded-md p-1 cursor-pointer my-4' htmlFor='image'>
                      Upload Image
                  </label>
                  <input id='image' type="file" style={{ display: 'none' }} onChange={(e) => setPhoto(e.target.files[0])} />
                  <button className='block mt-2 w-20 mx-auto bg-[#C7D3D1] text-black p-1 rounded-md border-[1px] border-white'>Olustur</button>
              </form>
          </div>
          <ToastContainer />
      </div>
  )
}
