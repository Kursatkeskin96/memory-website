'use client'

import React, { useRef, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function page() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (session?.user?.role ==! "admin") {
          redirect("/");
        }
      }, [status]);
    
    const userForm = useRef();

    const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (username === '' || password === '') {
      toast.error('Fill all fields');
      return;
    }
  
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
  
    try {
      if (typeof window !== 'undefined') {
        var currentURL = window.location.href;
        var urlParts = currentURL.split("/");
        var domain = urlParts[1];
      }
    
      const api = domain;
      const res = await fetch(`${api}/api/register`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ username, role, password }),
      });
  
      if (res.ok) {
        toast.success('Kullanici Eklendi');
        userForm.current.reset();
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
    <h1 className='text-lg mb-4'>Kullanici Olustur</h1>
  </div>
  <div className='flex flex-col justify-center items-center'>
    <form  ref={userForm} onSubmit={handleSubmit}>
      <input className='rounded-md pl-2 w-52 block' type="text" placeholder='Username' onChange={(e) => setUsername(e.target.value)} />
      <input className='rounded-md pl-2 w-52 block my-4' type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
      <select className='rounded-md pl-2 w-52 block mx-auto' value={role} id="roles" onChange={(e) => setRole(e.target.value)} >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

    <div className='flex justify-center items-center mt-6'>
      <button className='w-20 mx-auto bg-[#C7D3D1] text-black p-1 rounded-md border-[1px] border-white'>Olustur</button>
      </div>
    </form>
  </div>
</div>
  )
}
