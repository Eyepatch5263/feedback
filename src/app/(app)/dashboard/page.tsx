"use client"
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/Schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { Inria_Sans, Inria_Serif } from "next/font/google";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useUrl } from 'nextjs-current-url';


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
    const { href: currentUrl, pathname } = useUrl() ?? {};
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => { message._id != messageId }))
        fetchMessages()
    }
    const { data: session } = useSession()
    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })
    const { register, watch, setValue } = form
    const acceptMessages = watch("acceptMessages")
    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const res = await axios.get<ApiResponse>('/api/accept-message')
            setValue("acceptMessages", res.data.isAcceptingMessage)

        } catch (error) {
            console.error(error)
        }
        finally {
            setIsSwitchLoading(false)
        }

    }, [setValue])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)
        setIsSwitchLoading(false)
        try {
            const res = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(res.data.messages || [])
            if (refresh) {
                toast.success("Showing latest messages")
            }
        } catch (error: any) {
            toast.error(error.response.data.message)
        }
        finally {
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    }, [setIsLoading, setMessages])

    useEffect(() => {
        if (!session || !session!.user) return
        fetchMessages()
        fetchAcceptMessage()

    }, [session, setValue, fetchAcceptMessage, fetchMessages])

    const handleSwitchChange = async () => {
        try {
            const res = await axios.post<ApiResponse>('/api/accept-message', { acceptMessages: !acceptMessages })
            console.log(res)
            setValue("acceptMessages", !acceptMessages)
            toast.success(res.data.message)
        } catch (error: any) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }
    const username = session?.user.username
    
    const baseUrl = currentUrl?.split('/')[0]+'://'+currentUrl?.split('/')[2]
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast.success("Copied to clipboard")
    }


    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded-full w-full max-w-6xl">
            <h1 className={"text-4xl font-bold mb-4 capitalize "}>
                Welcome, {session?.user?.username}
            </h1>
            <div className="mb-4">
                <h2 className={"text-lg font-semibold mb-2 "+(inria.className)}>
                    Copy Your Unique Link
                </h2> {' '}
                <div className="flex items-center">
                    <Input  type="text" value={profileUrl} disabled className={"input input-bordered w-full p-2 mr-2 "+(inria2.className)} />
                    <Button className={"font-bold "+(inria.className)} onClick={copyToClipboard}>
                        Copy
                    </Button>
                </div>
            </div>
            <div className="mb-4 flex flex-row">
                <Switch {...register("acceptMessages")} checked={acceptMessages} onCheckedChange={handleSwitchChange} disabled={isSwitchLoading} />
                <span className={"ml-2 "+(inria2.className)}>
                    Accept Messages: {acceptMessages ? "On" : "Off"}
                </span>
            </div>
            <Button className="mt-4" variant={"outline"} onClick={(e) => {
                e.preventDefault()
                fetchMessages(true)
            }}>
                {isLoading ? (<Loader2 className="h-4 w-4 animate-spin" />) : (<RefreshCcw className="h-4 w-4" />)}
            </Button>
            <div className="mt-4  grid grid-cols-1 md:grid-cols-3 gap-6">
                {
                    messages.length !== 0 ? (
                        messages.map((message, i) => (
                            <MessageCard key={i} message={message} onMessageDelete={handleDeleteMessage} />
                        ))
                    )
                        : (
                            <p>No Messages to display</p>
                        )
                }
            </div>
        </div>
    );
}

export default Page
