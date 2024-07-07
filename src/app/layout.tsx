import Navbar from "@/components/Navbar"
import AuthProvider from "@/context/AuthProvider"
import { Inria_Serif, Inria_Sans } from "next/font/google";
import './globals.css'
import '../app/(app)/globals.css'
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
export const metadata = {
    title: 'Next.js',
    description: 'Generated by Next.js',
}

const inria = Inria_Serif({
    display: 'swap',
    subsets: ['latin'],
    weight: ["300", "400", "700"]
})

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <head>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                    <link rel="icon" href="/logos/favicon.ico" sizes="any" />
                    <link href="https://fonts.googleapis.com/css2?family=Inria+Serif:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap" rel="stylesheet" />
                </head>
            </head>
            <AuthProvider>
                <body>
                    <Navbar />
                    {children}
                    <Toaster
                        toastOptions={{
                            className: inria.className
                        }}
                        position="top-right"
                    />
                    <Footer/>
                </body>
            </AuthProvider>
        </html>
    )
}
