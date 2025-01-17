import {z} from "zod"

export const usernameValidation=z
.string()
.min(5,"Username must be at least 5 characters")
.max(20,"Username must be at most 20 characters")
.regex(/^[a-zA-Z0-9_]*$/,"Username must not contain special characters")


export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(5,{message:"Password must be at least 5 characters"}).max(30,{message:"Password must be at most 30 characters"})
})