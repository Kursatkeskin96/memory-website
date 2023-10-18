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

function Panel() {


  const [userStats, setUserStats] = useState(null);
  const [blogStats, setBlogStats] = useState(null);
  const [galleryStats, setGalleryStats] = useState(null);
  const [wordStats, setWordStats] = useState(null);
  const [userName, setUserName] = useState(null);
  const { data: session, status } = useSession();

useEffect(() => {
  const fetchUserName = async () => {
    try {
      if (!session) {
        // Session is not available yet, so exit the function
        return;
      }

      const userResponse = await fetch('/api/users');
      const userData = await userResponse.json();

      const currentUser = userData.find(user => user._id === session.user._id);
      if (currentUser) {
        setUserName(currentUser.username);

      } else {
        console.error('User not found');
      }
    } catch (error) {
      console.error('error fetching user data:', error);
    }
  };
  fetchUserName();
}, [session]); // Add session to the dependency array

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogResponse = await fetch('/api/blog');
        const galleryResponse = await fetch('/api/gallery');
        const wordResponse = await fetch('/api/kelime');
  
        const blogData = await blogResponse.json();
        const galleryData = await galleryResponse.json();
        const wordData = await wordResponse.json();

  
        setBlogStats(blogData);
        setGalleryStats(galleryData);
        setWordStats(wordData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  const blogsCount = blogStats ? blogStats.length : 0;
  const galleriesCount = galleryStats ? galleryStats.length : 0;
  const wordsCount = wordStats ? wordStats.length : 0;
  
  const chartBlogData = {
    labels: ['Blogs - Galleries - Words'],
    datasets: [
      {
        label: 'Blogs',
        data: [blogsCount],
        backgroundColor: '#68c8b1',
      },
      {
        label: 'Galleries',
        data: [galleriesCount],
        backgroundColor: '#6870FA',
      },
      {
        label: 'Words',
        data: [wordsCount],
        backgroundColor: '#35466a',
      },
    ],
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/users'); // Replace with your actual API endpoint
        const data = await response.json();
        setUserStats(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, []);

  let adminCount = 0;
  let userCount = 0;

  if (userStats) {
    adminCount = userStats.filter(user => user.role === 'admin').length;
    userCount = userStats.length - adminCount;
  }

const chartData = {
  labels: ['Admin', 'User'],
  datasets: [
    {
      data: [adminCount, userCount],
      backgroundColor: ['#68c8b1', '#6870FA'],
    },
  ],
};


  const CLOUD_NAME = 'dqtnjtoby'
  const UPLOAD_PRESET = 'gunes_blog'
  const router = useRouter();
  const userForm = useRef();
  const kelimeForm = useRef();
  const galleryForm = useRef();

  useEffect(() => {
    if (session?.user?.role ==! "admin") {
      redirect("/");
    }
  }, [status]);

  const [submitting, setSubmitting] = useState(false);

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

  const [kelime, setKelime] = useState('')
  const [desc, setDesc] = useState('')

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
    <div className='bg-[#141B2D] pb-20'>
  
      <div className='flex-col p-10'>
        <h1 className='text-white text-3xl uppercase'>Admin paneli</h1>
        <h3 className='text-[#68C8B1] mt-1'>Admin Paneline Hos Geldin <span className='underline'>{userName}</span></h3>
        <hr />
        </div>
      <div className='flex justify-center mx-auto mt-10 gap-24  flex-wrap'>
     <div>
      <Doughnut data={chartData} style={{ height: '200px', width: '200px' }} />
      </div>   
      <div>
      <Bar data={chartBlogData} style={{ height: '450px', width: '450px' }} />
      </div>   
        </div>
        <div className='flex justify-center items-center gap-20 mt-20 flex-wrap'>
          <Link href='/panel/kullanici-yonetimi'>
          <div className='bg-[#202A40] hover:bg-[#35466a] max-w-[240px] py-8 min-h-[184px] border-[1px] border-white rounded-md flex flex-col gap-3 justify-center items-center cursor-pointer'>
            <div className='flex justify-center text-white text-center w-full mt-2 text-xl'><AiOutlineUser size={24} />  <span className='ml-2'>Kullanici Yonetimi</span></div>
            <p className='text-[#3DA58B] mx-auto text-center'>Kullanicilari goruntulemek, eklemek, duzenlemek veya cikarmak icin tiklayin.</p>
          </div>
          </Link>

          <Link href='/panel/blog-yonetimi'>
          <div className='bg-[#202A40] hover:bg-[#35466a]  max-w-[240px] py-8 min-h-[184px] border-[1px] border-white  rounded-md flex flex-col gap-3 justify-center items-center cursor-pointer'>
            <div className='flex justify-center text-white text-center w-full mt-2 text-xl'><FaPencilAlt size={20} />  <span className='ml-2'>Blog Yonetimi</span></div>
            <p className='text-[#3DA58B] mx-auto text-center px-2'>Bloglari goruntulemek, duzenlemek veya silmek icin tiklayin.</p>
          </div>
          </Link>

          <Link href='/panel/kelime-yonetimi'>
          <div className='bg-[#202A40] hover:bg-[#35466a]  max-w-[240px] py-8  h-fit rounded-md border-[1px] border-white  flex flex-col gap-3 justify-center items-center cursor-pointer'>
            <div className='flex justify-center text-white text-center w-full mt-2 text-xl'><BsFillChatTextFill size={24} />  <span className='ml-2'>Kelime Yonetimi</span></div>
            <p className='text-[#3DA58B] mx-auto text-center'>Yeni kelimeler eklemek, duzenlemek veya silmek icin tiklayin.</p>
          </div>
          </Link>

          <Link href='/panel/galeri-yonetimi'>
          <div className='bg-[#202A40] hover:bg-[#35466a]  max-w-[240px] py-8 h-fit rounded-md border-[1px] border-white  flex flex-col gap-3 justify-center items-center cursor-pointer'>
            <div className='flex justify-center text-white text-center w-full mt-2 text-xl'><HiPhotograph size={24} />  <span className='ml-2'>Galeri Yonetimi</span></div>
            <p className='text-[#3DA58B] mx-auto text-center'>Yeni fotograflar eklemek, duzenlemek veya silmek icin tiklayin.</p>
          </div>
          </Link>
        </div>
        
    </div>
  );
}

export default Panel;