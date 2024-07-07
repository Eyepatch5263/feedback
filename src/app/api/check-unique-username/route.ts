import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/Schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect()
    try {
        const { searchParams } = new URL(request.url) //to get full url
        const requiredQueryParams = {
            username: searchParams.get("username")
        }
        //validate with zod
        const result = UsernameQuerySchema.safeParse(requiredQueryParams)
        if(!result.success){
            const userNameError=result.error.format().username?._errors
            return Response.json({
                success: false,
                message: userNameError
            },{status:400})
        }
        const {username}=result.data
        const existingVerifiedUser=await UserModel.findOne({
            username,
            isVerified:true
        })
        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        }
        return Response.json({
            success: true,
            message: "Username is available"
        },{status:200})
    } catch (error) {
        console.error("Error checking username", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 })
    }
}