import React from 'react'
import { auth } from '../auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import LogoutPage from '../components/logout/page'

/**
 * PAGE 2: DASHBOARD PAGE
 * Purpose:
 * - Main page after user logs in
 * - Protected route (only authenticated users can access)
 * - Displays user information and app content
 * 
 * Security:
 * - Checks if user is authenticated before rendering
 * - Redirects to home page if not logged in
 * - Session data contains: user.id, user.name, user.email, user.image
 * 
 */
export default async function DashboardPage() {

  /**
   * returns session object if user is logged in
   * returns null otherwise
   * 
   * Session structure:
   *  {
   *   user: {
   *     id: "user-id-here",
   *     name: "John Doe",
   *     email: "john@example.com",
   *     image: "https://profile-image-url.com/photo.jpg"
   *   },
   *   expires: "2024-12-31T23:59:59.999Z"
   * }
   */
  const session = await auth()

  /**
   * Authentication Guard
   * if user doesn't exist and they're trying to access this page
   * redirect back to home page
   */
  if(!session?.user){
    redirect("/")
  }

  /**
   * Just displays user name, email and image.
   */
  return (
    <div>
      WE MADE IT TO THE dashboard

      <p>{session?.user.name}</p>
      <p>{session?.user.email}</p>

      <Image
      src={session?.user.image}
      alt={session?.user.name}
      width={72}
      height={72}
      />

      <LogoutPage/>

    </div>
  )
}
