import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user
    console.log
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Invalid session or user"
        }, { status: 401 })
    }
    const email = user.email
    try {
        const user = await  UserModel.findOne({ email }).select("isVerified username isAcceptingMessage")
        if (!user) return Response.json({
            success: false,
            message: "User not found"
        }, { status: 404 })
        return Response.json({
            success: true,
            message:{user}
        })
    } catch (error) {
        console.error(error)
        return Response.json({
            success: false,
            message: "Error occurred while getting user information"
        }, { status: 500 })
    }
}