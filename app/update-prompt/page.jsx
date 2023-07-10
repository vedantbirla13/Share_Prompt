"use client"

import Form from '@components/Form'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const EditPrompt = () => {
    const [submitting, setSubmitting] = useState(false)
    const searchParams = useSearchParams()
    const promptId = searchParams.get("id");
    const router = useRouter()
    const [Post, setPost] = useState({
        prompt: '',
        tag: ''
    })

    useEffect(() => {
        
        const getPromptDetails = async() => {
           const response =  await fetch(`/api/prompt/${promptId}`)
           const data = await response.json()

           setPost({
            prompt: data.prompt,
            tag: data.tag
           })
        } 

        if(promptId) getPromptDetails()
    }, [promptId])
    

    const updatePrompt = async(e) => {
        e.preventDefault();
        setSubmitting(true);

        if(!promptId) return new alert('Prompt ID not found')
        try {
            const response = await fetch(`/api/prompt/${promptId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    prompt: Post.prompt,
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
        type="Edit"
        Post={Post}
        setPost={setPost}
        submitting={submitting}
        handleSubmit={updatePrompt}
    />
    
  )
}

export default EditPrompt