"use client"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { messageSchema } from '@/Schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Loader2 } from "lucide-react"
import { Inria_Sans, Inria_Serif } from 'next/font/google'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

import { Card, CardContent } from "@/components/ui/card"


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

  const params = useParams()
  const username = params.username
  const [contents, setContents] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  const [suggestedMessage, setSuggestedMessage] = useState([])
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    console.log(data)
    try {
      setIsSubmitting(true)
      const res = await axios.post(`/api/send-message`, data)

      toast.success(res.data.message)

    } catch (error: any) {

      toast.error(error.response.data.message)
    }
    finally {
      setIsSubmitting(false)
    }
  }
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: contents,
      username: username as string
    }

  })

  const suggestMessage = async () => {
    try {
      setSuggesting(true)
      const res = await axios.post('/api/suggested-messages')
      setSuggestedMessage([])
      setSuggestedMessage(res.data.message.split('||'))

    } catch (error) {
      console.log(error)
    }
    finally {
      setSuggesting(false)
    }
  }
  const handleSelect = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success("Copied to clipboard")
  }
  return (
    <>
      <main className='flex-grow flex flex-col justify-center mt-12 xl:mx-80 xl:px-12'>

      </main>
      <div className=" px-12 xl:mx-80 lg:mx-40 md:mx-10 sm:mx-2">
        <h1 className='text-4xl font-bold mb-4 capitalize'>
          Send an anonymous message
        </h1>
        <p className={'  text-base md:text-lg mb-5 ' + (inria.className)}>
          Explore feedback - where you can anonymously give me a feedback or drop me a message
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={"text-md " + (inria.className)}>Write your anonymous message here</FormLabel>
                  <FormControl>
                    <Input className={"w-full overflow-hidden text-md py-10 md:py-3 " + (inria2.className)} type="text" placeholder="Message" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className={"text-md mt-5 rounded-full font-bold w-full " + (inria.className)} disabled={isSubmitting} type="submit">
              {isSubmitting ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />
              </> : "Send"}
            </Button>
          </form>
        </Form>
      </div>


      <div className="mt-20 px-12 xl:mx-80 lg:mx-40 md:mx-10 sm:mx-2">
        <h2 className={"text-lg md:text-xl font-bold " + (inria.className)}>
          Clueless what to ask?
        </h2>
        <Button onClick={suggestMessage} className={"text-md rounded-full mt-5 mb-5 font-bold w-full " + (inria.className)} disabled={suggesting} >
          {suggesting ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />
          </> : "Suggest Message"}
        </Button>
        <h2 className={" text-md md:text-lg " + (inria2.className)}>
          Click Any Message below to select it
        </h2>
        <div className="border mt-5 border-b md:rounded-lg rounded-md border-gray-200 p-4">
          <h1 className={"text-lg font-bold md:text-xl " + (inria2.className)}>
            Messages
          </h1>
          {
            suggestedMessage.length !== 0 ? suggestedMessage.map((message, index) => (
              <Card key={index} className=" my-4 items-center flex flex-col justify-start">

                <CardContent key={index} className="flex flex-row w-full justify-start items-center px-4 py-2">
                  <span onClick={() => handleSelect(message)} key={index}  className={"cursor-pointer "+(inria2.className)}>
                    {message}
                  </span>
                </CardContent>
              </Card>
            )) : <>
              <Card className=" my-4 items-center flex flex-col justify-start">

                <CardContent onClick={(e)=>handleSelect("What's a skill you're secretly good at?")} className="flex flex-row w-full justify-start items-center px-4 py-2">
                  <span className={"cursor-pointer "+(inria2.className)}>
                  What is a skill you are secretly good at?
                  </span>
                </CardContent>
              </Card>
              <Card className=" my-4 items-center flex flex-col justify-start">

                <CardContent className="flex flex-row w-full justify-start items-center px-4 py-2">
                  <span onClick={(e)=>handleSelect("If you could travel to any fictional world, which would you choose and why?")} className={"cursor-pointer "+(inria2.className)}>
                  If you could travel to any fictional world, which would you choose and why?
                  </span>
                </CardContent>
              </Card>
              <Card className=" my-4 items-center flex flex-col justify-start">

                <CardContent className="flex flex-row w-full justify-start items-center px-4 py-2">
                  <span onClick={(e)=>handleSelect("What's the most surprising thing you've learned recently?")} className={"cursor-pointer "+(inria2.className)}>
                  What is the most surprising thing you have learned recently?
                  </span>
                </CardContent>
              </Card>
            </>
          }
        </div>
      </div>

    </>

  )
}

export default Page
