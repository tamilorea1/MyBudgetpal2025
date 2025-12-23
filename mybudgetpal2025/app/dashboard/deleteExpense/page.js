'use client'
import { deleteExpense } from '@/lib/actions'
import { useActionState } from 'react'

export default function DeleteExpenseFormPage({id}) {

    const initialState = {message: null, error: null}

    const [state, formAction, isPending] = useActionState(deleteExpense, initialState)

  return (
    <div>
        <form action={formAction}>
            {/**
             * Hides the input field but store an expense in that field
             */}
              <input type='hidden' name='id' value={id}/>
              <button type='submit' style={{ color: 'red' }} disabled={isPending}>
                {isPending ? 'Deleting expense...' : 'Delete'}
              </button>

              {state.error && <p>{state.error}</p>}

              {state.message && <p>{state.message}</p>}
        </form>
    </div>
  )
}
