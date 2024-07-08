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
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import Link from "next/link"
import { signInSchema } from "@/Schemas/signInSchema"
import { signIn } from "next-auth/react"
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
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof signInSchema>>({ //it's basically giving types to the form that it should be of type signupSchema
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        }
    })


    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true)
        const res = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        })
        if (res?.error) {
            setIsSubmitting(false)
            toast.error((res!.error?.split(":")[1]))

        }
        if (res?.url) {
            setIsSubmitting(false)
            toast.success("Logged in successfully")
            router.push('/dashboard')
        }

    }
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Feedback
                    </h1>
                    <p className={"mb-4 " + (inria.className)}>
                        Sign in to start your anonymous adventure
                    </p>
                </div>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={"text-md " + (inria.className)}>Email/Username</FormLabel>
                                    <FormControl>
                                        <Input className={inria2.className} placeholder="Email/Username" {...field} />
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
                                    <FormLabel className={"text-md " + (inria.className)}>Password</FormLabel>
                                    <FormControl>
                                        <Input className={inria2.className} type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className={"text-md font-bold w-full " + (inria.className)} disabled={isSubmitting} type="submit">
                            {isSubmitting ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            </> : "Sign In"}
                        </Button>
                    </form>
                </Form>
                <Button onClick={() => signIn("google")} type="submit" variant={"secondary"} className={"text-md font-bold w-full " + (inria.className)} >
                    Sign In With Google
                </Button>

                <div className={"text-center " + (inria.className)}>
                    <p className="text-center">
                        New account?
                        <Link href="/sign-up" className="text-gray-600 px-1 hover:text-black">
                            SignUp
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page
