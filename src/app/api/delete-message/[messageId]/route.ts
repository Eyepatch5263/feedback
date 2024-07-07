import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
    const messageID = params.messageId

    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Invalid session or user"
        }, { status: 401 })
    }
    try {
        const res = await UserModel.updateOne({
            _id: user!._id
        }, { $pull: { messages: { _id: messageID } } })
        if (res.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found"
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            message: "Message deleted successfully"
        })

    } catch (error) {
        console.log("Error in message delete route", error)
        return Response.json({
            success: false,
            message: "Error deleting message"
        }, { status: 500 })
    }
}