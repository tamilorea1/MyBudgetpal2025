/**
 * Handles all providers such as Credentials
 */

import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google" 
import CredentialsProvider from "next-auth/providers/credentials"
import {prisma} from "@/lib/prisma"
import bcrypt from "bcryptjs"

/**
 * Next auth gets us some objects
 * The handler object we get the GET & POST methods
 * The auth object helps get the current user session (who's logged in right now with their info)
 * signIn & signOut are methods used as their name implies
 */
export const {handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        /**
         *  GOOGLE OAUTH PROVIDER
         * Allows users to sign in with their Google account
         * 
         * Setup Requirements:
         * 1. Go to Google Cloud Console (console.cloud.google.com)
         * 2. Create a new project or select existing one
         * 3. Enable Google+ API
         * 4. Create OAuth 2.0 credentials
         * 5. Add authorized redirect URIs:
         *    - http://localhost:3000/api/auth/callback/google (development)
         *    - https://yourdomain.com/api/auth/callback/google (production)
         * 6. Copy Client ID and Client Secret to .env file
         * 
         * Environment Variables Needed:
         * - GOOGLE_CLIENT_ID: Your OAuth 2.0 Client ID from Google
         * - GOOGLE_CLIENT_SECRET: Your OAuth 2.0 Client Secret from Google
         */
        // GoogleProvider({
        //     //GOOGLE_CLIENT_ID should be in our .env file
        //     clientId: process.env.GOOGLE_CLIENT_ID,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        //     allowDangerousEmailAccountLinking: true,
        //     //This asks the user if they're fine using google to sign up
        //     authorization: {
        //         params: {
        //             prompt: "consent",
        //             access_type: "offline",
        //             response_type: "code"
        //         }
        //     }
        // }),

        /**
         * CREDENTIALS PROVIDER (Email & Password)
         * Allows users to sign in with email and password
         * This provider is more manual - YOU handle password verification
         * 
         * Security Notes:
         * - Passwords should NEVER be stored in plain text
         * - Always hash passwords with bcrypt before storing
         * - Always compare hashed passwords (never compare plain text)
         */
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"}
            },

            /**
             * This function is called when a user tries to log in
             * It's used to verify the credentials in comparison to data in database
             * 
             * Flow:
             * 1. Check if email and password are provided
             * 2. Find user in database by email
             * 3. Verify user exists and has a password (not OAuth-only user)
             * 4. Compare provided password with hashed password in database
             * 5. Return user data if valid, null if invalid
             * @param {*} credentials 
             * @returns 
             */
            async authorize(credentials) {
                if (!credentials.email || !credentials.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user || !user.password) {
                    return null
                }

                const passwordsMatch = await bcrypt.compare(credentials.password, user.password)

                if (passwordsMatch) {
                    return{
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    }
                }
                return null;
            }
        })
    ],
    
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({token, user, account}) {
            if (user) {
                token.id = user.id

                if (account?.provider === 'google') {
                    const dbUser = await prisma.user.findUnique({
                        where:{
                            email: user.email
                        }
                    })
                    if (dbUser) {
                        token.id = dbUser.id
                    }
                    else{
                        token.id = user.id
                    }
                }
            }
            return token
        },
        // async signIn({user, account}) {
        //     if(account.provider === 'google'){
        //         try {
        //             const existingUser = await prisma.user.findUnique({
        //                 where:{
        //                     email: user.email
        //                 }
        //             })

        //             if(!existingUser){
        //                 await prisma.user.create({
        //                     data: {
        //                         email: user.email,
        //                         name: user.name,
        //                     }
        //                 })
        //             }
        //             return true
        //         } catch (error) {
        //             console.log('Error saving Google user:', error)
        //             return false
        //         }
        //     }
        //     return true
        // },
        async session({session, token}) {
            if (token && session.user) {
                session.user.id = token.id
            }
            return session
        }
    }
})