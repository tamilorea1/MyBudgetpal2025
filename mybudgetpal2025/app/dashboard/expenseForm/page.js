'use client'
import { useActionState, useEffect, useState } from 'react'
import { addExpense } from '@/lib/actions'

export default function ExpenseFormPage() {
    const initialState = {message: null, error: null}

    const [state, formAction, isPending] = useActionState(addExpense, initialState)

    // Create a local state to control visibility
    const [showMessage, setShowMessage] = useState(false)

    useEffect(() => {
        if (state.message) {
            setShowMessage(true)
            // Clear the message after 3 seconds
            const timer = setTimeout(() => {
                setShowMessage(false)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [state.message])

return (
  <div 
  style={{
    background: 'white',
    padding: '24px',
    borderRadius: '20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  }}>
    <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', color: '#1e293b' }}>
      Add New Expense
    </h3>
    
    <form action={formAction} style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      gap: '12px',
      alignItems: 'flex-start' 
    }}>
      {/* Amount Input */}
      <div style={{ flex: '1', minWidth: '120px' }}>
        <input
          type='number'
          placeholder='$ 0.00'
          name='amount'
          step="0.01"
          required
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            fontSize: '0.9rem',
            outline: 'none',
            background: '#f8fafc'
          }}
        />
      </div>

      {/* Description Input */}
      <div style={{ flex: '2', minWidth: '200px' }}>
        <input
          type='text'
          placeholder='What was this for?'
          name='description'
          required
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            fontSize: '0.9rem',
            outline: 'none',
            background: '#f8fafc'
          }}
        />
      </div>

      {/* Category Dropdown */}
      <div style={{ flex: '1', minWidth: '140px' }}>
        <select name='categoryType' 
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          fontSize: '0.9rem',
          outline: 'none',
          background: '#f8fafc',
          cursor: 'pointer'
        }}>
          <option value="FOOD">Food</option>
          <option value="RENT">Rent</option>
          <option value="ENTERTAINMENT">Entertainment</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {/* Submit Button */}
      <button type='submit' disabled={isPending} 
      style={{
        padding: '12px 24px',
        borderRadius: '10px',
        border: 'none',
        background: '#2563eb',
        color: 'white',
        fontWeight: '600',
        fontSize: '0.9rem',
        cursor: isPending ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease'
      }}>
        {isPending ? 'Adding...' : 'Add Expense'}
      </button>
    </form>

    {/* Status Messages */}
    <div style={{ marginTop: '12px' }}>
      {state.error && <p style={{ color: '#dc2626', fontSize: '0.8rem', margin: 0 }}>{state.error}</p>}

      {/* Only show message if showMessage is true */}
        {showMessage && state.message && (
            <p style={{color: '#16a34a', fontSize: '0.8rem'}}>{state.message}</p>
        )}

    </div>
  </div>
)
}
