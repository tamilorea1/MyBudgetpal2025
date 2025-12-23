'use client'
import { useActionState } from 'react'
import { addExpense } from '@/lib/actions'

export default function ExpenseFormPage() {
    const initialState = {message: null, error: null}

    const [state, formAction, isPending] = useActionState(addExpense, initialState)


  return (
    <div>
      <form action={formAction}>
        <input
        type='number'
        placeholder='Enter expense amount'
        name='amount'
        step="0.01"
        />

        <input
        type='text'
        placeholder='Add a description for the expense'
        name='description'
        />

        <select name='categoryType'>
          <option>FOOD</option>
          <option>RENT</option>
          <option>ENTERTAINMENT</option>
          <option>OTHER</option>
        </select>

        <button type='submit' disabled={isPending}>
            {isPending ? 'Adding your expense...' : 'Add new expense'}
        </button>

        {state.error && <p style={{color: 'red'}}>{state.error}</p>}

        {state.message && <p style={{color: 'green'}}>{state.message}</p>}
      </form>
    </div>
  )
}
