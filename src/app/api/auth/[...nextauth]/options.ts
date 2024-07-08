import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import axios from "axios";
import toast from "react-hot-toast";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "email", type: "text", },
                password: { label: "Password", type: "password", }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })
                    if (!user) {
                        throw new Error("User not found")
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your account")
                    }

                    if (user) {
                        const validPassword = await bcrypt.compare(credentials.password, user.password)
                        if (validPassword) {
                            return user
                        }
                        else {
                            throw new Error("Invalid credentials")
                        }
                    }
                } catch (error: any) {
                    throw new Error(error)
                }

                return null
            }
        })
    ],
    callbacks: {
        async signIn({ account, user,profile }) {
            const email = user.email
            const username = user.name?.split(" ")[0].toLocaleLowerCase()
            const id = user.id
            
            if (account?.provider === "google") {
                await dbConnect()

                try {
                    const res = await fetch(process.env.BASE_URL+ "/api/sign-in-google", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email,
                            username,
                            id,
                            isVerified:true
                        })
                    })
                } catch (error) {
                    console.log(error)
                }
            }
            return true
        },

        async jwt({ token, session,user }) {
            if (token) {
                session = {
                    _id: token.sub,
                    email:token.email,
                    // isVerified: user.isVerified,
                    // isAcceptingMessage: user.isAcceptingMessage,
                    username: token.name?.split(" ")[0]
                }
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    _id: token.sub,
                    email:token.email,
                    // isVerified: user.isVerified,
                    // isAcceptingMessage: user.isAcceptingMessage,
                    username: token.name?.split(" ")[0]
                }
            }

            return session
        }
        // async jwt({ token, user }) {
        //     if (user) {
        //         token = {
        //             _id: user._id,
        //             isVerified: user.isVerified,
        //             isAcceptingMessage: user.isAcceptingMessage,
        //             username: user.username
        //         }
        //     }
        //     return token
        // },
        // async session({ session, token }) {
        //     session.user = {
        //         _id: token._id,
        //         isVerified: token.isVerified,
        //         isAcceptingMessage: token.isAcceptingMessage,
        //         username: token.username
        //     }
        //     return session
        // }
    },

    pages: {
        signIn: "/signin",
        signOut: "/auth/signout",
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET

}