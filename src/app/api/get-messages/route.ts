import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

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
    const userId = new mongoose.Types.ObjectId(user!._id)
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } }
        ])
        if (!user || user.length == 0) {
            return Response.json({
                success: false,
                message: "User not found"
            })
        }
        
        return Response.json({
            success: true,
            messages: user[0].messages
        })
    } catch (error) {
        console.error("Error in getting messages: ", error)
        return Response.json({
            success: false,
            message: "An error occurred while getting messages"
        }, { status: 500 })
    }

}