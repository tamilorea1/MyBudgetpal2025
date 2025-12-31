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
  <main 
    style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: '20px'
  }}>
    <div 
      style={{
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(12px)',
      padding: '40px',
      borderRadius: '24px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px', color: '#1a1a1a' }}>
        Create Account
      </h1>
      <p style={{ color: '#666', marginBottom: '32px', fontSize: '0.95rem' }}>
        Start tracking your expenses today.
      </p>

      <form action={formAction} style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#444', marginBottom: '6px', textTransform: 'uppercase' }}>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Jane Doe"
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', outline: 'none', transition: 'border-color 0.2s' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#444', marginBottom: '6px', textTransform: 'uppercase' }}>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="jane@example.com"
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#444', marginBottom: '6px', textTransform: 'uppercase' }}>Password</label>
          <input
            type="password"
            name="password"
            minLength={6}
            placeholder="••••••••"
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', outline: 'none' }}
          />
        </div>

        <button type="submit" disabled={isPending} 
          style={{
          background: '#2563eb',
          color: 'white',
          padding: '14px',
          borderRadius: '10px',
          border: 'none',
          fontWeight: '700',
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.7 : 1,
          transition: 'transform 0.1s ease'
        }}>
          {isPending ? 'Creating Account...' : 'Continue'}
        </button>

        {/**
          * Displays message form the server
          */}
        {state?.error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '16px', textAlign: 'center' }}>{state.error}</p>}
        {state?.message && <p style={{ color: '#16a34a', fontSize: '0.85rem', marginTop: '16px', textAlign: 'center' }}>{state.message}</p>}

        <p style={{ marginTop: '24px', fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
          Already have an account? {' '}
          <Link href='/login' style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>
            Log In
          </Link>
        </p>
      </form>
    </div>
  </main>
)
}




