"use client"

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { User } from "next-auth"
import { Button, buttonVariants } from './ui/button'
import { Inria_Sans, Inria_Serif } from 'next/font/google'
import { cn } from '@/lib/utils'

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

const Navbar = () => {

    const { data: session } = useSession()
    const user: User = session?.user as User
    return (
        <nav className='p-4 md:p-6 shadow-md'>
            <div className={'container mx-auto flex flex-col md:flex-row justify-between items-center '}>
                <div className='justify-start flex flex-row items-center gap-5 my-3'>
                    <Link href={'/dashboard'}>
                    <img src='/logos/logo_short.png' width={100}/>
                    </Link>
                <h1 className={'text-3xl font-bold '+(inria.className)}>Feedback</h1>
                </div>
                
                {
                    session ? (
                        <>
                            <Button  className='w-full md:w-auto' onClick={() => signOut()}>
                                Logout
                            </Button>
                        </>

                    ) : (

                        <Link className={cn(buttonVariants(),inria.className,"font-bold text-md")} href="/sign-in">
                            Login
                        </Link>

                    )
                }
            </div>
        </nav>
    )
}

export default Navbar
