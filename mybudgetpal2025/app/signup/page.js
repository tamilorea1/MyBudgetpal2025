'use client'

import { signUp } from "@/lib/actions"
import Link from "next/link"
import { useActionState, useState } from "react"

/**
 * We don't need to use useState for the name and email 
 * This is because of the 'action' prop in form
 * It gathers all the input in the form and stores it in an object called formData
 * 
 * We also don't need handleSubmit since server actions deal with that
 * @returns signup information
 */

export default function SignupPage() {

    //Server returns nothing before the first click
    const initialState = {message: null, error: null}

    /**
     * Hooks for useActionState
     * state returns the value from actions.js
     * formAction is a wrapper for 'signUp'
     * isPending is the initialState and its true while server is working
     */
    const [state, formAction, isPending] = useActionState(signUp, initialState)



  return (
    <div>
      <h1>
        Enter your information to Signup
      </h1>

      <form action={formAction}>
            <label>NAME</label>
            <input
            type="text"
            name="name"
            required
            placeholder="Enter your name"
            />

            <label>EMAIL</label>
            <input
            type="email"
            name="email"
            required

            placeholder="Enter your email"
            />

            <label>PASSWORD</label>
            <input
            type="password"
            name="password"
            minLength={6}
            required
            placeholder="Enter your Password"
            />

            <button type="submit" disabled={isPending}>
                {isPending ? 'Signing Up...' : 'SignUp'}
            </button>

            {/**
             * Displays message form the server
             */}
             {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}
             {state?.message && <p style={{ color: 'green' }}>{state.message}</p>}

            {/* <p>
                Already have an account?

                <Link href='/login'>
                    Login
                </Link>
            </p> */}
      </form>
    </div>
  )
}

