import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'
export async function POST(request: Request) {
    dbConnect()
    try {
        const { username, password, email } = await request.json()
        console.log(email)
        const existingUserByUsername = await UserModel.findOne({
            username,
            isVerified: false
        })
        const existingUserByEmail=await UserModel.findOne({
            email,
        })

        const verifyCode=Math.floor(100000 + Math.random() * 900000).toString();


        if(existingUserByUsername && existingUserByUsername.isVerified===true){
            return Response.json({
                success:false,
                message: "Username already exists"
            },{status:400})
        }

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message: "Email already exists"
                },{status:400})
            }
            else{
                const hashedPassword=await bcrypt.hash(password,10)
                existingUserByEmail.password=hashedPassword
                existingUserByEmail.verifyCode=verifyCode
                existingUserByEmail.verifyCodeExpireAt=new Date(Date.now()+3600000)
                await existingUserByEmail.save()
                const emailRes=await sendVerificationEmail(email,username,verifyCode)
                if(!emailRes.success){
                    return Response.json({
                        success:false,
                        message: "Failed to send verification email"
                    },{status:500})
                }
                return Response.json({
                    success: true,
                    message: "User registered successfully. Please check your email for verification"
                })
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate=new Date()
            expiryDate.setHours(expiryDate.getHours()+1)
            const newUser = new UserModel({
                username,
                password: hashedPassword,
                email,
                isVerified:false,
                verifyCodeExpireAt:expiryDate,
                verifyCode,
                messages:[]
            })
            await newUser.save()
        }
        
        const emailRes=await sendVerificationEmail(email,username,verifyCode)
        console.log(emailRes)
        if(!emailRes.success){
            return Response.json({
                success:false,
                message: "Failed to send verification email"
            },{status:500})
        }
        return Response.json({
            success: true,
            message: "User registered successfully. Please check your email for verification"
        })

    } catch (error) {
        console.log(error)
        return Response.json({
            success:false,
            message: "Error registering user"
        },{status:500})
    }



}
