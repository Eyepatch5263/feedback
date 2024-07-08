import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request:Request) {
    await dbConnect()
    try {
        const {email,username,id,isVerified}=await request.json()
        const user = await UserModel.findOne({email})
        if(user){
            return Response.json({
                success:true,
                message: "User already exists"
            },{status:200})
        }
        else{
            const user=new UserModel({
                username,
                email,
                isVerified,
                isAcceptingMessage:true,
                messages:[],
                uniqueId:id
            })
            await user.save()
        }
        return Response.json({
            success:true,
            message: "User created successfully"
        },{status:200})
    } catch (error) {
        console.log(error)
        return Response.json({
            success:false,
            message: "Error signing up user bt google"
        },{status:500})
    }
}