'use client'

import React, { useRef, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BsPencil, BsTrash} from 'react-icons/bs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export async function fetchUsers(){


  if (typeof window !== 'undefined') {
    var currentURL = window.location.href;
    var urlParts = currentURL.split("/");
    var domain = urlParts[1];
  }

  const api = domain;

  try {
    const res = await fetch(`${api}/api/users`, {cache: 'no-store'});
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
        toast.success('Successfully registered');
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
  
  // Get Users

  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchData = async () => {  // Renamed to "fetchData"
      const data = await fetchUsers();  
      setUsers(data);
      setLoading(false);
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

// edit user

const handleUpdateUser = async (id) => {
  if (typeof window !== 'undefined') {
    var currentURL = window.location.href;
    var urlParts = currentURL.split("/");
    var domain = urlParts[1];
  }

  const api = domain
  try {
    const body = {
      username,
      role,
    };

    // Make the PUT request here
    const response = await fetch(`${api}/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Error updating user");
    }

    router.push("/panel");
  } catch (error) {
    console.error("Error:", error);
    // Handle error
  }
};
const [editing, setEditing] = useState(false)

// loading state
const [loading, setLoading] = useState(true);


  return (
    <div className='bg-[#141B2D] pb-10 min-h-screen'>
      <div className='flex-col p-10'>
        <h1 className='text-white text-3xl uppercase'>Admin paneli</h1>
        <h3 className='text-[#68C8B1] mt-1'>Kullanici Yonetimi </h3>
        <hr />
        </div>
<div className='bg-[#202A40] text-white flex flex-col justify-start items-center w-[90%] lg:w-[50%] mx-auto rounded-md shadow-lg py-4'>
  <div>
    <h1 className='text-xl mb-4'>Kullanici Olustur</h1>
  </div>
  <div className='flex flex-col justify-start items-start text-black'>
    <form  ref={userForm} onSubmit={handleSubmit}>
      <input className='rounded-md pl-2 w-72 block' type="text" placeholder='Username' onChange={(e) => setUsername(e.target.value)} />
      <input className='rounded-md pl-2 w-72 block my-4' type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
      <select className='rounded-md pl-2 w-72 block mx-auto text-gray-400' value={role} id="roles" onChange={(e) => setRole(e.target.value)} >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

    <div className='flex justify-center items-center mt-6'>
      <button className='w-20 mx-auto bg-[#C7D3D1] text-black p-1 rounded-md border-[1px] border-white'>Olustur</button>
      </div>
    </form>
  </div>
  <ToastContainer />
</div>
<div className='bg-[#202A40] mt-10 text-white flex flex-col justify-start items-center w-[90%] lg:w-[50%] mx-auto rounded-md shadow-lg py-4'>
  <div>
    <h1 className='text-xl mb-4'>Kullanicilari Duzenle</h1>
  </div>
  <div className=''>
  {loading ? (
  // Render spinner while loading
  <div className="spinner"></div>
) : (
  users.map((user) => (
    <div className='flex w-[100%] justify-between items-center gap-6 my-2 hover:border-[1px] hover:border-white hover:bg-[#35466a] px-10 py-2 rounded-md' key={user._id}>
      <p className=' lg:w-96 md:w-56 w-[60%] pl-4'>{user.username}</p>
      <select className='rounded-md pl-2 lg:w-[30%] md:w-56 w-[30%] block mx-auto text-gray-400'
        value={user.role}
        id="roles"
        onChange={(e) => setRole(e.target.value)}
        disabled={!editing}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <Link href={`/panel/kullanici-yonetimi/${user?._id}`}>
        <p className=' cursor-pointer'>
          <BsPencil className=' text-[#68C8B1]' />
        </p>
      </Link>
      <p onClick={() => deleteUser(user._id)} className=' cursor-pointer'>
        <BsTrash className=' text-red-600' />
      </p>
    </div>
  ))
)}
  </div>
</div>
</div>
  )
}
