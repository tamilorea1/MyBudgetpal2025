'use client'

import { useActionState } from "react"
import { login } from "@/lib/actions"
import Link from "next/link"
export default function LoginPage() {


  const [state, formAction, isPending] = useActionState(login, {error: null})

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
          Welcome Back
        </h1>
        <p style={{ color: '#666', marginBottom: '32px', fontSize: '0.95rem' }}>
          Log in to manage your budget.
        </p>

        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          <div style={{ marginBottom: '16px' }}>
            <label 
              style={{ 
              display: 'block', 
              fontSize: '0.75rem', 
              fontWeight: '700', 
              color: '#444', 
              marginBottom: '6px', 
              textTransform: 'uppercase' 
            }}>Email Address</label>
            <input
              type='email'
              name='email'
              placeholder='Enter your email'
              required
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                borderRadius: '10px', 
                border: '1px solid #e5e7eb', 
                outline: 'none' 
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label 
              style={{ 
              display: 'block', 
              fontSize: '0.75rem', 
              fontWeight: '700', 
              color: '#444', 
              marginBottom: '6px', 
              textTransform: 'uppercase' 
            }}>Password</label>
            <input
              type='password'
              name='password'
              placeholder='Enter your password'
              required
              style={{ 
                width: '100%', 
                padding: '12px 16px', 
                borderRadius: '10px', 
                border: '1px solid #e5e7eb', 
                outline: 'none' 
              }}
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
            {isPending ? 'Logging you in...' : 'Login to continue'}
          </button>

          {state?.error && (
            <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '16px', textAlign: 'center' }}>
              {state.error}
            </p>
          )}

          <p style={{ marginTop: '24px', fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
            Don&apos;t have an account? {' '}
            <Link href='/signup' style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}
