"use client"
import { verifyOtpSchema } from '@/Schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'
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
import { Inria_Sans, Inria_Serif } from 'next/font/google'
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
    const router = useRouter()
    const username = useParams<{ username: string }>()
    const form = useForm<z.infer<typeof verifyOtpSchema>>({
        resolver: zodResolver(verifyOtpSchema)
    })
    const onSubmit = async (data: z.infer<typeof verifyOtpSchema>) => {
        try {
            const res = await axios.post(`/api/verify-code`, { username, code: data.code })
            toast.success("Verified Successfully")
            router.push('/sign-in')
        } catch (error: any) {
            toast.error(error.response.data.message)
            console.log(error)
        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className='text-center'>
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className={"mb-4 "+(inria.className)}>
                        Enter the verification code sent to your email
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className={"text-md "+(inria.className)}>Code</FormLabel>
                                    <FormControl>
                                        <Input className={inria.className} placeholder="Verification Code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className={"text-md font-bold w-full "+(inria.className)} type="submit">Verify</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Page
