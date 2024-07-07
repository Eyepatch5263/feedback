import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Invalid session or user"
        }, { status: 401 })
    }
    const userId = user!._id
    const { acceptMessages } = await request.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            isAcceptingMessage: acceptMessages
        })
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status to accept messages"
            }, { status: 401 })
        }
        return Response.json({
            success: true,
            message: "User status updated successfully"
        }, { status: 200 })
    } catch (error) {
        console.log("failed to update user status to accept messages ")
        return Response.json({
            success: false,
            message: "failed to update user status to accept messages"
        }, { status: 500 })
    }
}

export async function GET(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Invalid session or user"
        }, { status: 401 })
    }
    const userId = user!._id
    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 200 })
        }
        return Response.json({
            success: true,
            isAcceptingMessage: foundUser!.isAcceptingMessage
        }, { status: 200 })
    } catch (error) {
        console.log("failed to get user status ")
        return Response.json({
            success: false,
            message: "Failed to get user status"
        }, { status: 500 })
    }

}