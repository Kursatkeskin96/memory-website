'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const Edit = (ctx) => {
    const [username, setUsername] = useState("")
    const [role, setRole] = useState("")
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        async function fetchUser() {
            if (typeof window !== 'undefined') {
                var currentURL = window.location.href;
                var urlParts = currentURL.split("/");
                var domain = urlParts[1];
              }
            
              const api = domain;
            const res = await fetch(`${api}/api/users/${ctx.params.id}`)

            const user = await res.json()

            setUsername(user.username)
            setRole(user.role)
        }
        fetchUser()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(username === '' || role === ''){
            toast.error("All fields are required")
            return
        }

        try {
    
            const body = {
               username, 
                role,
            }
            if (typeof window !== 'undefined') {
                var currentURL = window.location.href;
                var urlParts = currentURL.split("/");
                var domain = urlParts[1];
              }
            
              const api = domain;
            
            const res = await fetch(`${api}/api/users/${ctx.params.id}`, {
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


            router.push('/panel/kullanici-yonetimi')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='h-screen bg-[#141B2D] '>
      <div className='flex-col p-10'>
        <h1 className='text-white text-3xl uppercase'>Admin paneli</h1>
        <h3 className='text-[#68C8B1] mt-1'>Kullanici Duzenleme </h3>
        <hr />
        </div>
            <div className='lg:w-[50%] w-[90%] shadow-lg h-fit mx-auto  bg-[#202A40] pt-5'>
                <h2 className='text-lg font-bold text-center mb-5 text-white'>Kullanici Düzenle</h2>
                <form className='' onSubmit={handleSubmit}>
                    <div className='flex flex-col justify-center items-center'>
                    <input className=' w-[60%] mb-6 mt-4 rounded-md text-center' value={username} type="text" placeholder='Kullanici Adi' onChange={(e) => setUsername(e.target.value)} />
                    <select className=' w-[60%] rounded-md text-center mb-10' value={role} placeholder='Role' onChange={(e) => setRole(e.target.value)}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>

                    </div>
                    <div className='w-[60%] flex justify-between mx-auto items-center pb-6 '>
                    <Link href={'/panel/kullanici-yonetimi'}>
                        <button className='bg-red-600 text-white border-[1px] border-white p-1 rounded-md w-20'>İptal</button>
                        </Link>
                    <button className='bg-[#68C8B1] border-[1px] border-white text-white p-1 w-20 rounded-md'>Kaydet</button>
                    </div>
                </form>
                </div>
            </div>

    )
}

export default Edit