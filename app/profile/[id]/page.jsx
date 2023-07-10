"use client"

import Profile from '@components/Profile'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const UserProfile = ({ params }) => {
    const { data: session } = useSession()
    const [Posts, setPosts] = useState([])
    const router = useRouter()
    const searchParams = useSearchParams();
    const userName = searchParams.get("name")

    useEffect(() => {
        const fetchPosts = async() => {
          const response = await fetch(`/api/users/${params?.id}/posts`);
          const data = await response.json()
          setPosts(data)
        }
    
       if(params?.id) fetchPosts()
      }, [])


    const handleEdit = (post) => {
      router.push(`/update-prompt?id=${post._id}`);
    }

    const handleDelete = async(post) => {
      const hasConfirmed = confirm("Are you sure you want to delete this prompt?")

      if(hasConfirmed){
        try {
          await fetch(`/api/prompt/${post._id.toString()}`, {
            method: "DELETE"
          });

          const filteredPost = Posts.filter((p) => p._id !== post._id )
          setPosts(filteredPost)
        } catch (error) {
          console.log(error)
        }
      }
    }

  return (
    <Profile 
        name= {userName}
        desc={`Welcome to ${userName}'s personalized profile page`}
        data={Posts}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
    />
  )
}

export default UserProfile