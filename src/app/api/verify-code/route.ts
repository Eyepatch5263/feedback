import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { verifyOtpSchema } from "@/Schemas/verifySchema";
import { useParams } from "next/navigation";
import { z } from "zod";
// const OtpQuerySchema=z.object({
//     code:verifyOtpSchema
// })

export async function POST(request:Request){
    await dbConnect();
    try {
        // const user=useParams()
        const {username,code}=await request.json()

        // const result=OtpQuerySchema.safeParse(requiredParams) //validating the code
        // console.log(result)
        // if(!result.success){
        //     const otpError=result.error.format().code?._errors
        //     console.log(otpError)
        //     return Response.json({
        //         success: false,
        //         message: otpError
        //     },{status:400})
        // }
        if(code.length!=6){
            return Response.json({
                success: false,
                message: "Verification code must be 6 characters"
            }, { status: 400 })
        }
        const existingUser=await UserModel.findOne(username)
        if(!existingUser){
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        if(existingUser.verifyCode===code && new Date()<existingUser.verifyCodeExpireAt){
            existingUser.isVerified=true
            await existingUser.save()
            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, { status: 200 })
        } else {
            return Response.json({
                success: false,
                message: "Incorrect or expired OTP"
            }, { status: 401 })
        }
    } catch (error) {
        console.error( error)
        return Response.json({
            success: false,
            message: "Error verifying otp"
        }, { status: 500 })
    }    
}