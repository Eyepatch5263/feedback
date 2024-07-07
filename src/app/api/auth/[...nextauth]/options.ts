import {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"

export const authOptions:NextAuthOptions={
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                identifier:{label:"email", type:"text",},
                password:{label:"Password", type:"password",}
            },
            async authorize(credentials:any):Promise<any>{
                await dbConnect()
                try {
                    const user=await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error("User not found")
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your account")
                    }

                if(user){
                    const validPassword=await bcrypt.compare(credentials.password, user.password)
                    if(validPassword){
                        return user
                    }
                    else{
                        throw new Error("Invalid credentials")
                    }
                }
                } catch (error:any) {
                    throw new Error(error)
                }
                
                return null
            }
        })
    ],
    callbacks:{
        async jwt({token, user}){
            if(user){
                token={
                    _id:user._id,
                    isVerified:user.isVerified,
                    isAcceptingMessage:user.isAcceptingMessage,
                    username:user.username
                }
            }
            return token
        },
        async session({session, token}){
            session.user={
                _id:token._id,
                isVerified:token.isVerified,
                isAcceptingMessage:token.isAcceptingMessage,
                username:token.username
            }
            return session
        }
    },

    pages:{
        signIn:"/signin",
        signOut:"/auth/signout",
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET

}