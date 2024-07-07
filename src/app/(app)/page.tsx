"use client"
import * as React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from '@/messages.json'
import Autoplay from "embla-carousel-autoplay"
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
const Home = () => {
  return (
    <>
      <main className=' flex flex-col h-full items-center justify-center px-4 md:px-24 py-12'>
        <section className='text-center mb-8 md:mb-12'>
          <h1 className={'text-3xl md:text-4xl font-bold ' + (inria.className)}>
            Dive into the the World of Anonymous Conversation
          </h1>
          <p className={'mt-3 md:mt-4 text-base md:text-lg ' + (inria2.className)}>
            Explore feedback - where you can anonymously give me a feedback or drop me a message
          </p>
        </section>
        <Carousel plugins={[Autoplay({ delay: 1500 })]} className="w-full items-center max-w-xs">
          <CarouselContent>
            {
              messages.map((message, i) => (
                <CarouselItem key={i}>
                  <div className="p-1">
                    <Card className=" my-4 items-center text-center flex flex-col justify-start">
                      <CardHeader>
                        <CardTitle className={"text-xl font-bold "+(inria.className)}>
                          {message.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-row w-full justify-start items-center px-4">
                        <span className={"cursor-pointer " + (inria2.className)}>
                          {message.Content}
                        </span>
                      </CardContent>
                      <CardFooter>
                        <span className={"text-sm font-semibold "+(inria2.className)}>
                          {message.received}
                        </span>
                      </CardFooter>
                    </Card>

                  </div>
                </CarouselItem>
              ))
            }
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
    </>

  )
}

export default Home
