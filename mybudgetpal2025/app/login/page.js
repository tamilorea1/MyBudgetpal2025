'use client'

import { useActionState } from "react"
import { login } from "@/lib/actions"

export default function LoginPage() {


  const [state, formAction, isPending] = useActionState(login, {error: null})

  return (
    <div>
        <form action={formAction}>
          <label>Email</label>
          <input
          type='email'
          name='email'
          placeholder='Enter your email'
          required
          />

          <label>Password</label>
          <input
          type='password'
          name='password'
          placeholder='Enter your password'
          required
          />

          <button type="submit" disabled={isPending}>
            {isPending ? 'Logging you in...' : 'Login to continue'}
          </button>

          {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}

        </form>
    </div>
  )
}
