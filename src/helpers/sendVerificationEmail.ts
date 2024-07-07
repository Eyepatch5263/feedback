import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email: string, username: string, verifyCode: string):Promise<ApiResponse> {
    console.log(email)
    console.log(username)
    console.log(verifyCode)
    try {
        const res=await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "FeedBack | Verification Code",
            react: VerificationEmail({username,otp:verifyCode}),
        });
        return {
            success: true,
            message: "Verification email sent successfully",
        }
    } catch (error) {
        console.error("Email Error: ", error)
        return { success: false, message: "Failed to send Verification email" }
    }
}