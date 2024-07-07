import { z } from "zod";
import { getServerSession } from "next-auth";


export const messageSchema=z.object({
    content:z.string().min(10,{message:"Content must be at least 10 characters"}).max(300,{message:"Content must be at most 300 characters"}),
    username:z.string()
})