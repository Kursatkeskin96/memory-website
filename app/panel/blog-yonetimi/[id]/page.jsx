'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

const Edit = (ctx) => {
    const CLOUD_NAME = 'dqtnjtoby'
    const UPLOAD_PRESET = 'gunes_blog'

    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [photo, setPhoto] = useState("")
    const { data: session, status } = useSession()
    const router = useRouter()

    if (typeof window !== 'undefined') {
        var currentURL = window.location.href;
        var urlParts = currentURL.split("/");
        var domain = urlParts[1];
      }
    
      const api = domain

    useEffect(() => {
        async function fetchBlog() {
            const res = await fetch(`${api}/api/blog/${ctx.params.id}`)

            const blog = await res.json()

            setTitle(blog.title)
            setDesc(blog.desc)
            setPhoto(blog.imageUrl)
        }
        fetchBlog()
    }, [])

    if (status === 'loading') {
        return <div className='bg-[#141B2D] min-h-screen flex justify-center items-center'>
            <div className='spinner'></div>
        </div>
    }

    if (status === 'unauthenticated') {
        return <p>
            Access Denied
        </p>
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(title === '' || desc === ''){
            toast.error("All fields are required")
            return
        }

        try {
            let imageUrl = null
            if(photo){
                imageUrl = await uploadImage()
            }

            const body = {
                title, 
                desc,
            }

            if(imageUrl != null){
                body.imageUrl = imageUrl
            }
            
            const res = await fetch(`${api}/api/blog/${ctx.params.id}`, {
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${session?.user?.accessToken}`
                },
                method: "PUT",
                body: JSON.stringify(body)
            })

            if(!res.ok){
                throw new Error("Error has occured")
            }

            const blog = await res.json()

            router.push(`/panel/blog-yonetimi`)
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

            return imageUrl
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='min-h-screen pb-10 bg-[#141B2D] '>
        <div className='flex-col p-10'>
          <h1 className='text-white text-3xl uppercase'>Admin paneli</h1>
          <h3 className='text-[#68C8B1] mt-1'>Blog Duzenleme </h3>
          <hr />
          </div>
          <div className='lg:w-[50%] w-[90%] shadow-lg h-fit mx-auto  bg-[#202A40] pt-5'>
                <h2 className='text-2xl mb-10 font-bold text-center text-white'>Blog Düzenle</h2>
                <form className='' onSubmit={handleSubmit}>
                    <div className='flex flex-col justify-center items-center'>
                    <Image className='rounded-md' src={photo} alt='image' width={100} height={100} />
                    <input className='rounded-md  mt-6 mb-4 w-[70%] text-center' value={title} type="text" placeholder='Başlık' onChange={(e) => setTitle(e.target.value)} />
                    <textarea className='rounded-md  mt-6 mb-4 w-[70%] text-center h-96 resize-none' value={desc} placeholder='Mesajınız...' onChange={(e) => setDesc(e.target.value)} />
                    </div>
                    <div className='flex justify-center items-center my-2'>
                    <label className='mb-5 w-36 text-center cursor-pointer bg-white rounded-md p-1 border-[1px] border-black' htmlFor='image'>
                    Resim Yükle
                    </label>
                    <input id='image' type="file" style={{ display: 'none' }} onChange={(e) => setPhoto(e.target.files[0])} />
                    </div>
                    <div className='w-[60%] flex justify-between mx-auto items-center pb-6 '>
                    <Link href={'/panel/blog-yonetimi'}>
                        <button className='bg-red-600 text-white border-[1px] border-white p-1 rounded-md w-20'>İptal</button>
                        </Link>
                    <button className='bg-[#68C8B1] border-[1px] border-white text-white p-1 w-20 rounded-md'>Kaydet</button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Edit