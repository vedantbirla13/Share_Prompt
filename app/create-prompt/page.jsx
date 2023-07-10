"use client"

import Form from '@components/Form'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const CreatePrompt = () => {
    const [submitting, setSubmitting] = useState(false)
    const { data: session } = useSession()
    const router = useRouter()
    const [Post, setPost] = useState({
        prompt: '',
        tag: ''
    })

    const createPrompt = async(e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch('/api/prompt/new', {
                method: 'POST',
                body: JSON.stringify({
                    prompt: Post.prompt,
                    userId: session?.user.id,
                    tag: Post.tag
                })
            })

            if(response.ok){
                router.push("/")
            }
        } catch (error) {
            console.log(error)
        } finally {
            setSubmitting(false)
        }
    }

  return (
    <Form 
        type="Create"
        Post={Post}
        setPost={setPost}
        submitting={submitting}
        handleSubmit={createPrompt}
    />
    
  )
}

export default CreatePrompt