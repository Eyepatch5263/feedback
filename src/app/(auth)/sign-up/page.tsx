"use client"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signUpSchema } from '@/Schemas/signUpSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDebounceCallback } from 'usehooks-ts'
import * as z from 'zod'
import {Loader2} from 'lucide-react'
import Link from "next/link"
import { Inria_Sans, Inria_Serif } from "next/font/google"


const inria2 = Inria_Serif({
    display: 'swap',
    subsets: ['latin'],
    weight: ["300", "400", "700"]
})
const inria = Inria_Sans({
    display: 'swap',
    subsets: ['latin'],
    weight: ["300", "400", "700"]
})

const Page = () => {
    const [username, setUsername] = useState<any>("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounced = useDebounceCallback(setUsername, 300)
    const router = useRouter()
    const form = useForm<z.infer<typeof signUpSchema>>({ //it's basically giving types to the form that it should be of type signupSchema
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    })
    const checkUsernameUnique = async () => {
        if (username) {
            setIsLoading(true)
            setUsernameMessage("")
            try {
                const res = await axios.get(`/api/check-unique-username?username=${username}`)
                setUsernameMessage(res.data.message)
            } catch (error:any) {
                    if(error.response.data.message.length==2)
                        setUsernameMessage(error.response.data.message[1])
                    else{
                        setUsernameMessage(error.response.data.message)
                    }
            }
            finally {
                setIsLoading(false)
            }
        }
    }
    
    useEffect(() => {
        checkUsernameUnique()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const res = await axios.post("/api/signup", data)
            toast.success('Account created Successfully')
            router.push(`/verify/${username}`)
        } catch (error: any) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Feedback
                    </h1>
                    <p className={"mb-4 "+(inria.className)}>
                        Sign up to start your anonymous adventure
                    </p>
                </div>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={"text-md "+(inria.className)}>Username</FormLabel>
                                    <FormControl>
                                        <Input className={inria2.className} placeholder="Username" {...field} onChange={(e)=>{field.onChange(e)
                                            debounced(e.target.value)
                                        }}/>
                                    </FormControl>
                                    {
                                        isLoading &&(
                                            <Loader2 className="animate-spin"/>
                                        )
                                        
                                    }
                                    <p className={`text-sm ${usernameMessage==="Username is available"?"text-green-500":"text-red-500"}`}>
                                        {usernameMessage}
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={"text-md "+(inria.className)}>Email</FormLabel>
                                    <FormControl>
                                        <Input className={inria2.className} type="email" placeholder="Email" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={"text-md "+(inria.className)}>Password</FormLabel>
                                    <FormControl>
                                        <Input className={inria2.className} type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className={"text-md font-bold w-full "+(inria.className)} disabled={isLoading} type="submit">
                            {isSubmitting?<><Loader2 className="mr-2 w-4 h-4 animate-spin"/>
                            </>:"Sign Up"}
                        </Button>
                    </form>
                </Form>
                <div className={"text-center "+(inria.className)}>
                    <p className="text-center">
                        Already a member?
                        <Link href="/sign-in" className="text-gray-600 px-1 hover:text-black">
                        SignIn
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page
