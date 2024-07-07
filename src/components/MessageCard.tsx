import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import toast from "react-hot-toast";
import { Inria_Sans, Inria_Serif } from "next/font/google";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

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
const MessageCard = ({ message, onMessageDelete }: { message: Message, onMessageDelete: (messageId: string) => void }) => {
    const handleDelete = async () => {
        try {
            const res = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            onMessageDelete(message._id as string)
            toast.success("Message deleted successfully")
        } catch (error) {
            console.log(error)
        }

    }
    return (
        <div>
            <Card style={{ height: "200px" }}>
                <CardHeader className="flex justify-center">
                    <CardTitle className={"flex flex-row justify-between items-center " + (inria.className)}>Message
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant={"outline"}><X className="w-4 h-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className={inria.className}>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription className={inria2.className}>
                                        This action cannot be undone. This will permanently delete your
                                        account and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className={inria.className}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className={inria.className} onClick={handleDelete}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardTitle>
                </CardHeader>
                <CardContent className={inria2.className}>
                    <p>{message.content}</p>
                </CardContent>

            </Card>
        </div>
    );
};

export default MessageCard;
